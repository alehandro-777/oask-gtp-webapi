const LastValue = require('../models/value-last')

exports.select =  async (q, begin, end) => {

    const points_ids_arr = createPointsFilter(q);

    const data = await LastValue.aggregate([
        { $match: { $or: points_ids_arr, time_stamp: { $lt: end, $gte: begin }} },
        { $group: { _id: "$time_stamp", values: { $push : "$$ROOT" }, } },
        { $addFields: { local_dd_mm_yyyy: { $dateToString: { format: "%d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },           
        { $addFields: { local_hh_mm: { $dateToString: { format: "%H:%M", date: "$_id", timezone: "Europe/Kiev" } } } }       
    ]);            
    return data;
}

function createPointsFilter(templateObj) {
    const result = [];
    for (const prop in templateObj) {
        const filter = { point: templateObj[prop] };
        result.push(filter);
    }   
    return result;
}

exports.applyTemplate = (templateObj, data)  => {
    const result = [];
    
    data.forEach(q_res => {
        let row = {
            _id: q_res._id,
            local_dd_mm_yyyy: q_res.local_dd_mm_yyyy, 
            local_hh_mm: q_res.local_hh_mm
        };
        q_res.values.forEach(v => {
            let point = v.point;
            let value = v.value;
            for (const prop in templateObj) {
                if (templateObj[prop] == point) {
                    row[prop] = value;
                }
            }
        });
        result.push(row);
    });

    return result;
}