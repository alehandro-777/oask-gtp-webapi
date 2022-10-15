const ValueLast = require('../models/value-last')
const Value = require('../models/value')
const SmartDate = require('../../smartdate')

/*
exports.update_previous_period = async (point_id, begin, end) => {
    let exec_day = new Date(begin);
    let result = [];
    while (exec_day.getTime() <= end.getTime()) {
        let doc = await exports.update_previous_value(point_id, exec_day);            
        exec_day = new Date(exec_day.getTime() + 1 * 24 * 3600 * 1000);
    }         
    return result;
}
*/


exports.update_active_gas_day = async (params, ts) => {

    let [save_id, in_id, out_id] = params;

    const saved_data = await ValueLast.aggregate([
        { $match: { point: save_id, time_stamp: { $lt: ts } }},
        { $sort : { time_stamp : -1 } },
        { $limit : 1 },           
    ]); 

    //console.log(saved_data)
    
    if (saved_data.length == 0) {
        return null;
    }

    let previous_val = saved_data[0].value;

    const in_data = await ValueLast.find({ point: in_id, time_stamp: ts }).exec();            
    if (in_data.length == 0) {
        return null;
    }

    const out_data = await ValueLast.find({ point: out_id, time_stamp: ts }).exec(); 
    if (out_data.length == 0) {
        return null;
    }

    let in_val = in_data.length == 0 ? 0 : in_data[0].value;
    let out_val = out_data.length == 0 ? 0 : out_data[0].value;

    let act_gas = previous_val + in_val - out_val;

    let result ={};
    result.user = saved_data[0].user;
    result.point = save_id;
    result.time_stamp = ts;
    result.state = "Normal";
    result.value = act_gas;

    const doc = await Value.create(result);
    await exports.update_last_values(doc.point, ts)

    return doc;
}

//update active gas cumulative total
exports.update_active_gas_period = async (params, begin) => {
    return await update_period(params, begin, exports.update_active_gas_day);
}

//update db_point_last_values collection
exports.update_last_value = async (point, ts) => {
    const data = await Value.aggregate([
        { $match: { point:point, time_stamp: ts  }},
        { $sort : { created_at : -1 } },
        { $limit : 1 },
        { $addFields: { _id: { time_stamp: ts, point: point } } },
        { $addFields: { updated_at: new Date() } },
        { $merge: { into: "db_point_last_values", whenMatched: "replace" } }            
    ]);            
    return data;
}  

//summ from 1 day month
exports.update_sum_from_1_month_day = async (params, ts) => {
    let [point_id] = params;
    let begin = new SmartDate(ts).currGasDay().firstMonthDay().dt;
    
    const data = await ValueLast.aggregate([
        { $match: { point: point_id, time_stamp: { $lte: ts, $gte: begin }  }},
        { $group: { _id: "$point",  
                    value: {$sum: "$value"}, 
                    user:  {$first: "$user"},
                    point:  {$first: "$point"},
                  }     
        },
        { $addFields: { _id: { time_stamp: ts, point: point_id } } },
        { $addFields: { updated_at: new Date() } },
        { $addFields: { time_stamp: ts } },
        { $addFields: { state: "Normal" } },

        { $merge: { into: "db_point_1_day_values", whenMatched: "replace" } }            
    ]); 

    return data; 
}

//update period db_point_1_day_values collection
exports.update_sum_from_1_d_period = async (params, begin) => {
    return await update_period(params, begin, exports.update_sum_from_1_month_day);
}

exports.update_previous_value = async (params, ts) => {
    let [point_id] = params;   

    const data = await ValueLast.aggregate([
        { $match: { point: point_id, time_stamp: { $lt: ts }  }},
        { $sort: { time_stamp: -1  }},
        { $limit: 1},
        { $addFields: { _id: { time_stamp: ts, point: point_id } } },
        { $addFields: { updated_at: new Date() } },
        { $addFields: { time_stamp: ts } },
        { $merge: { into: "db_point_previous_values", whenMatched: "replace" } }            
    ]); 

    return data; 
}


//db_point_previous_values collection
exports.update_previous_period = async (params, begin) => {
    return await update_period(params, begin, exports.update_previous_value);
}

//first point_id - is source point !!!
update_period = async (params, begin, func) => {
    let [point_id] = params;

    let result = [];   
    let last_values = await ValueLast
            .find({ point: point_id, time_stamp: { $gte: begin }  })
            .select("time_stamp").sort("time_stamp")
            .exec();

    for (let i = 0; i < last_values.length; i++) {
        const last_value = last_values[i];
        let doc = await func(params, last_value.time_stamp);
        result.push(doc);                    
    }

    return result;
}
