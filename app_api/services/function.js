const Func = require('../models/function')
const LastValue = require('../models/value-last')
const SmartDate = require('../../smartdate')
const Point = require('../models/db-point')

//функция - возвращает скалярное значение

class FunctionService {
    
    async calc(func_id, ts)   {
        let func = await Func.findById(func_id);;           
        if (!func) throw new Error("Function Not found");

        let value = await this.exec_all(func, ts);            
        return value ;
    }
  
    //dynamic function - don't need save func in database !
    async call(func, ts)   {
        let value = await this.exec_all(func, ts);            
        if(!value) throw new Error("function call err");
        return value ;
    }

    //exec func by name  func.short_name === xxxx
    async exec_all(func, ts) {
        return await eval("this."+func.short_name+"(func, ts)");
    }

    async summ(func, ts) {
        //console.log(func.params, data);
        let total =0;
        let result = {};
        let params = [];

        result.params = [];
        result.state = "Error";

        for (let i = 0; i < func.params.length; i++) {
            const p = func.params[i];
            await this.flatParams(p, params)
        }

        let positive_ids = params.map(e=> Math.abs(e));

        const data = await this.selectParamsValues( positive_ids, ts);

        for (let i = 0; i < params.length; i++) {
            const pnt = params[i];
            let k =  pnt < 0 ? -1 : 1;
            let api_data = data.find(d => d._id.point == Math.abs(pnt));
            let v = api_data ? api_data.value : 0;
            let kvp = {k:pnt, v: v};  //0 - is default value !!!
            result.params.push(kvp);
            total = total + k * v;
        }

        //console.log(data);
        
        result.func = func._id;
        result.time_stamp = ts;
        result.value = total;
        result.state = "Normal";
        return result;
    }

    async findActualState(func, ts) {
        let result = {};
        const data = await LastValue.find({ point: func.params[0], time_stamp: { $lte: ts} }).sort("-time_stamp").limit(1);
        result.func = func._id;
        result.time_stamp = ts;
        result.value = data.length > 0 ? data[0].value : null;
        result.state = data.length > 0 ? data[0].state : "No state";
        return result;
    }

    //наработка (полные часы) с последнего ремонта - пока так 1- work, 4-repair
    async gpaWorkHoursFromRepair(func, ts) {
        let result = {};
        const data = await LastValue.find({ point: func.params[0], time_stamp: { $lte: ts} }).sort("time_stamp");
        let moto_hours =0;
        let startWorkDt;
        let endWorkDt;

        for (let i = 0; i < data.length; i++) {
            const point = data[i];

            //is start
            if (point.value == 1) {
                startWorkDt = new Date(point.time_stamp);
                endWorkDt = null;
                continue;
            } else {
                endWorkDt = new Date(point.time_stamp);
                if (startWorkDt) {
                    let workSpan = endWorkDt.getTime()  - startWorkDt.getTime();
                    startWorkDt = null;
                    endWorkDt = null;
                    moto_hours = moto_hours + Math.ceil( workSpan / (3600*1000) );    
                } 
            }            
            //set in repair
            if (point.value == 4) {
                moto_hours =0;
            }
        }

        //if last event is Work calc to current ts
        if (startWorkDt) {            
            let workSpan = ts.getTime()  - startWorkDt.getTime();
            startWorkDt = null;
            endWorkDt = null;
            moto_hours = moto_hours + Math.ceil( workSpan / (3600*1000) );    
        } 



        result.func = func._id;
        result.time_stamp = ts;
        result.value = moto_hours;
        result.state = "Normal";

        return result;
    }

    //средние обороты по КЦ/КС
    async rotate_compressor_avg_kc(func, ts) {
        //console.log(func.params, data);
        let result = {};
        let total=0;
        result.params = [];
        result.working_counter = 0;

        const data = await this.selectParamsValues( func.params, ts);

        for (let i = 0; i < func.params.length; i++) {
            const pnt = func.params[i];
            let api_data = data.find(d => d._id.point == pnt);
            let v = api_data ? api_data.value : 0;
            let kvp = {k:pnt, v: v};  //0 - is default value !!!
            result.params.push(kvp);
            if (v > 0) {
                total = total + v;
                result.working_counter++;
            }            
        }

        //console.log(data);
        let e = total / result.working_counter;
        result.func = func._id;
        result.time_stamp = ts;
        result.value = isNaN(e) ? 0 : Math.round(e);
        result.state = "Normal";
        return result;
    }

    async e_compression(func, ts) {
        //console.log(func.params, data);
        let result = {};
        result.params = [];

        const data = await this.selectParamsValues( func.params, ts);

        let in_data = data.find(d => d._id.point == func.params[0]);
        let out_data = data.find(d => d._id.point == func.params[1]);

        let in_p = in_data ? in_data.value : 0;
        let kvp = {k:func.params[0], v: in_p};  //0 - is default value !!!
        result.params.push(kvp);

        let out_p = out_data ? out_data.value : 0;
        kvp = {k:func.params[1], v: out_p};  //0 - is default value !!!
        result.params.push(kvp);

        //console.log(data);
        let e = out_p / in_p;
        result.func = func._id;
        result.time_stamp = ts;
        result.value = isNaN(e) ? 1 : e;
        result.state = "Normal";
        return result;
    }

    // for summ only ?? TODO  (2022-06-07 временное решение - подумать)
    async flatParams(par, params_array) {
        let sign = Math.sign(par);
        let pnt = await Point.findById(Math.abs(par)).populate("func").exec();
        if (pnt.func) {
            for (let i = 0; i < pnt.func.params.length; i++) {
                const p = pnt.func.params[i] * sign;
                await this.flatParams(p, params_array);
            }
        } else {
            params_array.push(par);
        }
    }

    async from_1_day(func, ts) {
        let result = {};
        let begin = new SmartDate(ts).currGasDay().firstMonthDay().dt;

        let data = await this.getPointsStats(func.params, begin, ts);
        
        result.func = func._id;
        result.time_stamp = ts;
        result.state = "Normal";

        if (data.length > 0 ) {
            result.value = data[0].sum;
        } else {
            result.value = 0;            
        }
        
        return result;             
    }

    async last_day(func, ts) {
        let result = {};
        let begin = new SmartDate(ts).addDay(-1).dt;
        let data = await this.selectParamsValues(func.params, begin);

        result.func = func._id;
        result.time_stamp = ts;
        result.state = "Normal";

        if (data.length > 0 ) {
            result.value = data[0].value;
        } else {
            result.value = 0;            
        }
        
        return result;             
    }

    async active_gas(func, ts) {
        let save_id = func.params[0];
        let in_id = func.params[1];
        let out_id = func.params[2];
        
        const saved_data = await LastValue.aggregate([
            { $match: { point: save_id, time_stamp: { $lt: ts } }},
            { $sort : { time_stamp : -1 } },
            { $limit : 1 },           
        ]);            

        let saved_val = saved_data.length == 0 ? 0 : saved_data[0].value;

        //async flatParams(par, params_array)
        let sum_params_array = [];
        
        await this.flatParams(in_id, sum_params_array);
        await this.flatParams(-out_id, sum_params_array);

        let in_out = await this.summ({params:sum_params_array}, ts);

        let act_gas = saved_val + in_out.value;

        let result ={};
        result.func = func._id;
        result.time_stamp = ts;
        result.state = "Normal";
        result.value = act_gas;

        return result;
    }

    //----------- 19-08-2022 ---------------------------
    async calcGpaInWork(func, ts) {
        return await this.calcGpaInState(func, ts, [1]);
    }
    async calcGpaInReserve(func, ts) {
        return await this.calcGpaInState(func, ts, [2,3]);
    }
    async calcGpaInRemont(func, ts) {
        return await this.calcGpaInState(func, ts, [4,5,6]);
    }

    //1- work, 2 3 - reserv, 4 - remont, 5 - AZ 6 VZ
    async calcGpaInState(func, ts, states) {
        const data = await LastValue.aggregate([
            { $match: { point : {$in: func.params}, time_stamp: { $lt: ts }} },
            { $sort: { time_stamp: 1 } },
            { $group: { _id: "$point", 
                        state: {$last: "$state"},
                        value: {$last: "$value"},
                        time_stamp: {$last: "$time_stamp"}
                    }  
            },
            { $match: { value : {$in: states} }}
        ]);
        const result = {};
        result.func = func._id;
        result.time_stamp = ts;
        result.state = "Normal";
        result.value = data.length;
        return result;
    }

    //-----------------------------------------
    async selectParamsValues(points, dt) {
        const points_ids_arr = this.createPointsFilter(points);
        const data = await LastValue.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: dt }}            
        ]);            
        return data;
    }

    async getPointsStats(points, begin, end) {
        const points_ids_arr = this.createPointsFilter(points);

        const data = await LastValue.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: { $lte: end, $gte: begin }} },
            { $group: { _id: "$point", 
                        count: {$sum: 1}, 
                        avg: {$avg: "$value"},
                        sum: {$sum: "$value"},
                        max: {$max: "$value"},
                        min: {$min: "$value"},
                        begin: {$min: "$time_stamp"},
                        end: {$max: "$time_stamp"}
                    }  
            }           
        ]);            
        return data;
    } 

    createPointsFilter(points)  {
        return points.map( id => { return {"point": id} } );
    }

}

module.exports = new FunctionService();