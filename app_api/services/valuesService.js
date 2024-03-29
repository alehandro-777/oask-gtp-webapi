const Value = require('../models/value')

class ValuesService {
    constructor (model) {
        this.Value = model
    }

    async selectTable(points, begin, end) {
        const points_ids_arr = this.createPointsFilter(points);

        const data = await this.Value.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: { $lt: end, $gte: begin }  }},
            { $sort : { created_at : -1 } },

            { $group: { _id: { time_stamp:"$time_stamp", point:"$point"}, 
                        state: {$first: "$state"}, 
                        value: {$first: "$value"}, 
                        deleted: {$first: "$deleted"},
                        created_at: {$first: "$created_at"}  
                      }  
            },
            { $sort : { _id : 1 } }
            
        ]);            
        return data;
    }
    
    async selectDtTable(points, begin, end) {
        
        let result =[];
        let data = await  this.selectTable(points, begin, end);
        let resultObject = this.groupByDays(data);
        for (const key in resultObject) {
            if (Object.hasOwnProperty.call(resultObject, key)) {
                const valArray = resultObject[key];
                let newrow = {};                
                newrow["#"] = new Date(key).toISOString();
                this.bindValues( newrow, valArray);
                result.push(newrow);
            }
        }
        return result;
    }  

    bindValues(row, values) {
        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            row[v.point] = v.value; //date/time
        }
    }

    groupByDays(data) {
        let res = {};       
        for (let i = 0; i < data.length; i++) {
            let val = data[i];           
            if (!res[val._id.time_stamp]) {
                res[val._id.time_stamp] = [];
            } 
            res[val._id.time_stamp].push({"point":val._id.point, "value":val.value});
        }
        return res;
    }

    async selectRow(points, dt) {
        const points_ids_arr = this.createPointsFilter(points);

        const data = await this.Value.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: dt }},
            { $sort : { created_at : -1 } },

            { $group: { _id: { time_stamp:"$time_stamp", point:"$point"}, 
                        state: {$first: "$state"}, 
                        value: {$first: "$value"}, 
                        deleted: {$first: "$deleted"},
                        created_at: {$first: "$created_at"}  
                      }  
            },
            { $sort : { _id : 1 } }
            
        ]);            
        return data;
    }  
    async tableStats(points, begin, end) {
        const points_ids_arr = this.createPointsFilter(points);

        const data = await this.Value.aggregate([
            { $match: { $or: points_ids_arr, time_stamp: { $lt: end, $gte: begin }} },
            { $sort : { created_at : -1 } },

            { $group: { _id: { time_stamp:"$time_stamp", point:"$point"}, 
            state: {$first: "$state"}, 
            value: {$first: "$value"}, 
            deleted: {$first: "$deleted"},
            created_at: {$first: "$created_at"}  
                    }  
            },
            { $match: { deleted:false  }},
            { $group: { _id: "$_id.point", 
                        count: {$sum: 1}, 
                        avg: {$avg: "$value"},
                        sum: {$sum: "$value"},
                        max: {$max: "$value"},
                        min: {$min: "$value"},
                    }  
            },
            { $sort : { _id : 1 } }
            
        ]);            
        return data;
    }     
    
    async findActualValue(point_id, time_stamp) {
        const data = await this.Value.find({ point: point_id, time_stamp: time_stamp }).sort("-created_at").limit(1);
        return data;
    }

    async findActualState(point_id, time_stamp) {
        const data = await this.Value.find({ point: point_id, time_stamp: { $lte: time_stamp} }).sort("-time_stamp").limit(1);
        return data;
    }
    
    async findValueChanges(point_id, time_stamp) {
        const data = await this.Value.find({ point: point_id, time_stamp: time_stamp }).sort("-created_at");
        return data;
    }

    createPointsFilter(points)  {
        return points.map( id => {return {"point": id} } );
    }
}

module.exports = new ValuesService(Value);