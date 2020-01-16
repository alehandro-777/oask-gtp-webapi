var database = [];

exports.create = (collection, obj) => {

    if( !database[collection] ) database[collection] =[];

    database[collection].push(obj);
};

exports.findOne = (collection, predicat) => {
    return database[collection].find(predicat);
};