const mongoose = require( 'mongoose' );

require('../app_api/models/db');  //init mongoose

console.log("Fill test dataset !");
const SmartDate = require('../smartdate');
const Value =require('../app_api/models/value');

mongoose.connection.on('connected', async () => {   

    await Value.deleteMany({}) 

    const values = CreateTestValues();

    let data = await Value.insertMany(values);
    console.log(data);

    process.exit(0);
});

function  CreateTestValues() {
    const values =[]
    //points
    for (let k = 1; k < 21; k++) {

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
            for (let j = 1; j < 5; j++) {
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