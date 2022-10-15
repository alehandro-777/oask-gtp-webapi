const Query = require('../models/query')
const LastValue = require('../models/value-last')
const Value = require('../models/value')
const Func_serv = require('./function')
const SmartDate = require('../../smartdate')
const moment = require('moment')
const Obj_serv = require('./table_object')

class QueryService {

    async exec(query_id, begin, end)   {

        const q = await Query.findById(query_id);

            if (!q) throw new Error("Function Not found");

            let value = await this.exec_all(q, begin, end);           

            return value;
    }

    async exec_all(q, begin, end) {
        return await eval("this."+q.short_name+"(q, begin, end)");
    }

// query short_name === func name

    async exec_funcs_every_day(q, begin, end) {
        let result = [];
        let exec_day = new Date(begin);

        while (exec_day.getTime() <= end.getTime()) {

            for (let i = 0; i < q.params.length; i++) {
                let id = q.params[i];
                let data = await Func_serv.calc(id, exec_day);
                //console.log(data);    
                result.push(data);
            }
    
            exec_day = new Date(exec_day.getTime() + 1 * 24 * 3600 * 1000);
        }

        return result;
    }
    
//add 2022-06-07 call functions without database
    async select_func_results_by_name_step_day(q, begin, end, func_name) {
        let result = [];
        let exec_day = new Date(begin);

        while (exec_day.getTime() < end.getTime()) {            
            for (let i = 0; i < q.params.length; i++) {
                let func = {};
                let id = q.params[i];
                func._id = id;
                func.short_name = func_name;
                func.params = [id];
                let data = await Func_serv.call(func, exec_day);
                //console.log(data);    
                result.push(data);
            }
    
            exec_day = new Date(exec_day.getTime() + 1 * 24 * 3600 * 1000);
        }
        return result;
    }

    async select_func_results_by_name_step_hour(q, begin, end, func_name) {
        let result = [];
        let exec_day = new Date(begin);

        while (exec_day.getTime() < end.getTime()) {            
            for (let i = 0; i < q.params.length; i++) {
                let func = {};
                let id = q.params[i];
                func._id = id;
                func.short_name = func_name;
                func.params = [id];
                let data = await Func_serv.call(func, exec_day);
                //console.log(data);    
                result.push(data);
            }
    
            exec_day = new Date(exec_day.getTime() + 3600 * 1000);
        }
        return result;
    }

    async select_func_results_from_1_day(q, begin, end) {
        return await this.select_func_results_by_name_step_day(q, begin, end, "from_1_day");
    }

    async select_func_results_last_day(q, begin, end) {
        return await this.select_func_results_by_name_step_day(q, begin, end, "last_day");
    }

    async select_func_results_findActualState(q, begin, end) {
        return await this.select_func_results_by_name_step_hour(q, begin, end, "findActualState");
    }

    async select_func_results_gpaWorkHoursFromRepair(q, begin, end) {
        return await this.select_func_results_by_name_step_hour(q, begin, end, "gpaWorkHoursFromRepair");
    }
    
    async select_func_results_rotate_compressor_avg_kc(q, begin, end) {
        return await this.select_func_results_by_name_step_hour(q, begin, end, "rotate_compressor_avg_kc");
    }
//----------------------------------
    async selecttable(q, begin, end) {
        //console.log( q, begin, end )
        const points_ids_arr = this.createPointsFilter(q.params);
        const data = await LastValue.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: { $lt: end, $gte: begin }  }},
            { $sort: { time_stamp:1 } },
            { $addFields: { ts_parts: { $dateToParts: { date: "$time_stamp", timezone:"Europe/Kiev" } } } },          
            { $addFields: { local_dd_mm_yyyy: { $dateToString: { format: "%d.%m.%Y", date: "$time_stamp", timezone: "Europe/Kiev" } } } },           
            { $addFields: { local_hh_mm: { $dateToString: { format: "%H:%M", date: "$time_stamp", timezone: "Europe/Kiev" } } } },
            { $addFields: { query: q._id } },
        ]);
        //console.log(data)            
        //console.log( q, begin, end, result )
        return data;
    }
    
    async selectrows(q, begin, end) {
        let qres = await Obj_serv.select( q.params[0], begin, end);       
        let data = Obj_serv.applyTemplate(q.params[0], qres);
        return data;
    }

    async selectrawtable(q, begin, end) {
        const points_ids_arr = this.createPointsFilter(q.params);
        const data = await Value.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: { $lt: end, $gte: begin }  }}                       
        ]);            
        return data;
    }
    
    async tablestats(q, begin, end) {
        const points_ids_arr = this.createPointsFilter(q.params);

        const data = await LastValue.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: { $lt: end, $gte: begin }} },
            { $group: { _id: "$point", 
                        count: {$sum: 1}, 
                        avg: {$avg: "$value"},
                        sum: {$sum: "$value"},
                        max: {$max: "$value"},
                        min: {$min: "$value"},
                        begin: {$min: "$time_stamp"},
                        end: {$max: "$time_stamp"}
                    }  
            },
            { $addFields: { ts_parts: { $dateToParts: { date: "$begin", timezone:"Europe/Kiev" } } } },          
            { $addFields: { local_dd_mm_yyyy: { $dateToString: { format: "%d.%m.%Y", date: "$begin", timezone: "Europe/Kiev" } } } },           
            { $addFields: { local_hh_mm: { $dateToString: { format: "%H:%M", date: "$begin", timezone: "Europe/Kiev" } } } },
            { $addFields: { query: q._id } },
           
        ]);            
        return data;
    }

    // add 27-06-22 - calc GPA number in reserve, work, repair
    async gpa_work_reserv_repair_hours(q, begin, end) {
        const points_ids_arr = this.createPointsFilter(q.params);
        
        const data = await LastValue.find(
            { $or: points_ids_arr, time_stamp: { $lt: end }} )
            .sort({time_stamp:-1})
            .exec();            
        
        let exec_day = new Date(begin);
        let result = [];

        while (exec_day.getTime() < end.getTime()) {

            let counters = {    
                reserv_counter:0,
                repair_counter:0,
                work_counter:0
            }
            
            q.params.forEach(p => {
                this.test_state(counters, data, p, exec_day);            
            });
            
            result.push( this.create_new_value( exec_day, "work", counters.work_counter, q) );
            result.push( this.create_new_value( exec_day, "reserv", counters.reserv_counter, q) );
            result.push( this.create_new_value( exec_day, "repair", counters.repair_counter, q) );

            exec_day = new Date(exec_day.getTime() + 3600 * 1000);  //next hour
        }    
        
        //console.log( q, begin, end, result )
        
        return result;
    }  

    async panorama(q, begin, end) {
        let _begin = new SmartDate(begin);
        _begin.currGasDay().addDay(-2); 
        const data = await LastValue.aggregate([
            { $match: { point:{ $in:q.params }, time_stamp: { $gte: _begin.dt, $lte: begin }} },
            { $group: { _id: "$time_stamp", 
                values: { $addToSet : {point: {$toString: "$point"}, value:"$value"} }, } },
            { $project:{tmp:{$arrayToObject: 
                {$zip:{inputs:["$values.point", "$values.value"]}}}}
            },
            { $addFields: {"tmp._id":"$_id"} },
            { $replaceRoot:{newRoot:"$tmp"} },
            { $addFields: { "#1": { $dateToString: { format: "%d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },           
            { $addFields: { "#2": { $dateToString: { format: "%H:%M", date: "$_id", timezone: "Europe/Kiev" } } } },
            { $addFields: { "#3": { $dateToString: { format: "%H:%M %d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },
            { $addFields: { "_id": { $toString: "$_id" } } },
            { $sort: { _id:1 } }
        ]);            
        return data;

    }



//----------------------------------    
    create_new_value(time_stamp, state, value, query) {
        let result = {time_stamp, state, value};

        //{ $addFields: { ts_parts: { $dateToParts: { date: "$time_stamp", timezone:"Europe/Kiev" } } } },          
        //{ $addFields: { local_dd_mm_yyyy: { $dateToString: { format: "%d.%m.%Y", date: "$time_stamp", timezone: "Europe/Kiev" } } } },           
        //{ $addFields: { local_hh_mm: { $dateToString: { format: "%H:%M", date: "$time_stamp", timezone: "Europe/Kiev" } } } },
        result.local_dd_mm_yyyy = moment(time_stamp).local().format('DD.MM.YYYY');//format('YYYY-MM-DD HH:mm:ss');
        result.local_hh_mm = moment(time_stamp).local().format('HH:mm');//format('YYYY-MM-DD HH:mm:ss');
        result.query = query._id
        return result
    }

    test_state(counters, data, point, ts) {        
        let s1 = this.find_state(data, 1, point, ts);
        if (s1) {
            counters.work_counter++;
            return;
        };
        let s2 = this.find_state(data, 2, point, ts);
        if (s2) {
            counters.reserv_counter++;
            return;
        }
        let s4 = this.find_state(data, 4, point, ts);
        if (s4) {
            counters.repair_counter++;
            return;
        };        
    }

    //1- work, 2 3 - reserv, 4 - remont, 5 - AZ 6 VZ
    find_state(data, state, point, ts) {
        //find first point value
        let current_state = data.find(d => d.point == point && 
            new Date(d.time_stamp).getTime() <= ts.getTime());
            
        //console.log(current_state)    
            
        if ( !current_state ) return false;
        if (current_state.value == state) {
            return true;
        } else {
            return false;  
        }
    }
//------------------------------------------------------------------------------------------
    createPointsFilter(points)  {
        return points.map( id => {return {"point": id} } );
    } 
}

module.exports = new QueryService();