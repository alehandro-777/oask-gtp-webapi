const InpBlock = require('../models/block-input')


class InputBlockService {
    async packTable(role, ts) {
        const data = await InpBlock.aggregate([
            { $match: { role:role, time_stamp: ts  }},
            { $sort : { created_at : -1 } },
            { $group: { _id: { time_stamp:"$time_stamp", role:"$role"}, 
                        active: {$first:"$active"}, 
                        role: {$first:"$role"},
                        user: {$first:"$user"},
                        granularity :{$first:"$granularity"},
                        time_stamp: {$first:"$time_stamp"}
                      }  
            },
            { $addFields: { updated_at: new Date() } },
            { $merge: { into: "input_blocks_lasts", whenMatched: "replace" } }            
        ]);            
        return data;
    } 
}

module.exports = new InputBlockService();