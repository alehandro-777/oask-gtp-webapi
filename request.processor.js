const repository = require('./repository');

// обработка шаблона - преобразование в ассоциативный массив 
module.exports = (request) => {

    let result = {};
    let date = new Date(request.date);

    result['date'] = date;
    result['doc'] = request.doc[0];

    request.row.forEach( function(item, i, arr) { 
        item.col.forEach( function(item, i, arr) {
        //обработка каждой ячейки, если не известная функция или константа выводится без вычисления 
        try{
            let key = item.$.id.toUpperCase();
            result[key] = item._.toLowerCase();
            result[key] = item._= eval(result[key]);
            item._= result[key];
        }
        catch (err){
            //console.log(err); 
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