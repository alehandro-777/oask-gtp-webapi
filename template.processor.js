const repository = require('./repository');

// обработка xml шаблона - результат- ассоциативный  массив "параметр : значение"
// если вычисление не возможно - присвоить исходное значение
module.exports = (request) => {

    let result = {};
    let date = new Date(request.date);

    result['date'] = date;
    result['doc'] = request.doc[0];

    request.row.forEach( function(row, i, arr) { 
        /*
        row: [
            { col1: [Array], col2: [Array] },
            { col1: [Array], col2: [Array] },
            { col1: [Array], col2: [Array] }
        ]
        */

        let keys = Object.keys(row);   // – возвращает массив ключей.

        keys.forEach( function(col, i, arr) {
        //обработка каждой ячейки, если не известная функция или константа выводится без вычисления 
        row[col].forEach( function(cell, i, arr) {
            try{
                let key = cell.$.id.toUpperCase();  //аттрибут 
                result[key] = cell._.toLowerCase(); //значение элемента
                result[key] = cell._= eval(result[key]);    //попытка вычислить 
                cell._= result[key];    //изменения исходной ХМЛ
            }
            catch (err){
                //console.log(err); 
            }   
        }); //column elements loop       
        }); //inner column loop
    });     //rows loop
    return result;
}

//набор разрешенных в шаблоне функций
function selectsingle(collection, datetime, attributes, precision, p5)
{
    //console.log(collection, datetime, attributes, precision, p5);
    return 111+0.223;
}