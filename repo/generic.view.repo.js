


exports.findOne = (query) => {
    return createView1(query);
};

function createView1(query) {
    return new Promise((resolve, reject) => {
        model.findOne(query , function(err, docs) {
            if(err) {  reject(err); return;  }
            
            resolve(docs);
        });

    });
};