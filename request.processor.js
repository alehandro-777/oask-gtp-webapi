const repository = require('./repository');

// обработка шаблона - преобразование в ассоциативный массив 
module.exports = (request) => {

    let result = {};
    let date = new Date(request.date);


    result['date'] = JSON.stringify(date);
    result['doc'] = request.doc[0];

    request.row.forEach( function(item, i, arr) { 
        item.col.forEach( function(item, i, arr) {
        //console.log(item); 
        try{
            result[item.$.id.toLowerCase()] = item._.toLowerCase();
            result[item.$.id.toLowerCase()] =  eval(result[item.$.id.toLowerCase()]);
            item._ = result[item.$.id.toLowerCase()];
        }
        catch (err){
//            console.log(err); 
        }

        });
    });
    return result;
}

function selectsingle(collection, datetime, attributes, precision, p5)
{
    //console.log(collection, datetime, attributes, precision, p5);
    return 111+0.223;
}