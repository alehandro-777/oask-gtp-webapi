const mongoose = require( 'mongoose' );

require('../app_api/models/db');  //init mongoose

console.log("Fill test dataset !");
const SmartDate = require('../smartdate');
const Value =require('../app_api/models/value');
const ValueLast =require('../app_api/models/value-last');

mongoose.connection.on('connected', async () => {   

    //await Value.deleteMany({}) 

    for (let k = 1; k < 40; k++) {
        //const values = CreateTestValuesDays(k);
        const values = CreateLastValuesHours(k);
        
        let data = await ValueLast.insertMany(values);
        console.log("k= ", k)
    }
    
  
//    console.log(data);

    process.exit(0);
});

function  CreateTestValuesDays(point) {
    const values =[]
    //points
        //days
        for (let i = 1; i < 1*366; i++) {
            let dt = new SmartDate();
            let val = new ValueLast();
            
            val.value = 10.0*i;
            val.user = 1;
            val.point = point;        
            val.time_stamp = dt.nextGasDay().addDay(-i).dt;
            val.created_at = val.time_stamp;
            val._id = {time_stamp:val.time_stamp, point:point};

            values.push(val);            
        }
    return values;
}

function  CreateLastValuesHours(point) {
    const values =[]
    //points
        //days
        for (let i = 1; i < 24*100; i++) {
            let dt = new SmartDate();
            let val = new ValueLast();
            
            val.value = 10.0*i;
            val.user = 1;
            val.point = point;        
            val.time_stamp = dt.nextGasDay().addHours(-i).dt;
            val.created_at = val.time_stamp;
            val._id = {time_stamp:val.time_stamp, point:point};

            values.push(val);            
        }
    return values;
}

function  CreateTestValuesHours() {
    const values =[]
    //points
    for (let k = 1; k < 40; k++) {

        //hours
        for (let i = 1; i < 24*30+1; i++) {
            let dt = new SmartDate();
            let val = new Value();
            val.value = 10.0*i;
            val.user = 1;
            val.point = k;        
            val.time_stamp = dt.nextGasDay().addHours(-i).dt;
            val.created_at = val.time_stamp;
            values.push(val);
            
            //edits
            for (let j = 1; j < 3; j++) {
                let val = new Value();
                val.value = 10*i + j*0.1;
                val.user = 1;
                val.point = k;        
                val.time_stamp = dt.dt;
                val.created_at = new SmartDate().nextGasDay().addHours(-i).addMinutes(j+1).dt;
    
                values.push(val);
        
            }
        }
    

    }    
    return values;
}