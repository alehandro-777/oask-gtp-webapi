const express = require('./index');
const mong_model = require('./mongoose.model');


exports.findOne = (query) => {
  return useRegimAggregate();
};

//setInterval(() => updateRegimDksForms([1, 2, 3, 4, 5 ,6, 7], "2018-02-19T00:00:00Z"), 10000);

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function kvpToObjact(kvp_array) {
  return kvp_array.reduce((res, current) => { 
    res[current.key] = current.value;
    return res;
  }, {});
}



function useRegimAggregate(objects, from) {
  return new Promise((resolve, reject) => {
    let collection = express.mongoose.connection.db.collection('formConvValues');

    //TODO filter parameters for report !!!

    collection.find({}, function (err, cursor) {
      if (err) reject(err);
      cursor.toArray().then(values => {
        let total_row = {};
        let result = [];
        values.forEach(element => {
          let row = {"time" : element._id.hour};
          element.data.forEach(value_object => {
            for (let [key, value] of Object.entries(value_object.data)) {
              row[value_object.data.key+'_'+key] = value;
            }
            if (!total_row[value_object.data.key]) total_row[value_object.data.key] =  [];
            total_row[value_object.data.key].push(value_object.data);           
          });  
          result.push(row);
        });        
        result.push(total_row);
        resolve(result);
      });
    });
  });
}
