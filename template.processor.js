const repository = require('./repository');


// обработка root - объекта xml шаблона - результат- создает из атрибутов и одиночных элементов словарь "параметр : значение"
// внимание ! строки имеют жесткое имя "row" в ХМЛ !!!!!!!!!!!

exports.estract = (xmlObject) => {

    let result = {};

    //обработка одиночных элементов
    let keys = Object.keys(xmlObject);   // – возвращает массив ключей.

    keys.forEach( function(xmlelm, i, arr) {
        if(xmlelm !== "row") {
            result[xmlelm] = xmlObject[xmlelm][0];  //create simple key:value
        }
        else{
            //обработка строк
            xmlObject.row.forEach( function(row, i, arr) { 

                let keys = Object.keys(row);   // – возвращает массив ключей.

                keys.forEach( function(col, i, arr) {
                //обработка каждой ячейки, если не известная функция или константа выводится без вычисления 
                row[col].forEach( function(cell, i, arr) {
                    try{
                        let key = cell.$.id;    //аттрибут id
                        result[key] = cell._;   //значение элемента
                    }
                    catch (err){
                        //console.log(err); 
                    }   
                }); //column elements loop       
                }); //inner column loop
            });     //rows loop
        }        
    });
    return result;
}

//обработка root - объекта xml шаблона
//преобразование "объект шаблона" -> "объект отчет"
//return ничего не возвращает - модифицирует исходный объект
exports.translate = (xmlObject, par) => {
    //обработка одиночных элементов
    let keys = Object.keys(xmlObject);   // – возвращает массив ключей.
    keys.forEach( function(xmlelm, i, arr) {
        if(xmlelm !== "row") {
            try{
                xmlObject[xmlelm][0] = eval(xmlObject[xmlelm][0]);  //try evaluate  Date.parse(par["date"]) - со временем не понятно...
            }
            catch (err){
                //console.log("Translate error ", xmlelm, "  " , err); 
            }   
        }
        else{
            //обработка строк
            xmlObject.row.forEach( function(row, i, arr) { 

                let keys = Object.keys(row);   // – возвращает массив ключей в строке.

                keys.forEach( function(col, i, arr) {
                //обработка каждой ячейки, если не известная функция или константа выводится без вычисления 
                row[col].forEach( function(cell, i, arr) {
                    try{
                        //console.log(xmlelm, " 2 ", xmlObject[xmlelm]);
                        cell._ = eval(cell._.toLowerCase());  //try to evaluate
                    }
                    catch (err){
                        //console.log("Translate error ", cell._, "  " , err); 
                    }   
                }); //column elements loop       
                }); //inner column loop
            });     //rows loop
        }              
    });//all keys loop
}

// обработка root - объекта xml шаблона - результат- создает массив объектов "эл-т : значение"
// внимание ! строки имеют жесткое имя "row" в ХМЛ !!!!!!!!!!!

exports.estractMany = (xmlObject) => {
  
    let result = {row:[]};
    //обработка одиночных элементов
    let keys = xmlObject.row;   // – возвращает массив row.

    keys.forEach( function(xmlelm, i, arr) {
        let resrow = [];

        //обработка каждой row      

        let columns = Object.keys(xmlelm);   // – возвращает массив ключей-columns.
            //обработка col
            columns.forEach( function(col, i, arr) { 
                let rescolumn = {};                
                rescolumn[col] = xmlelm[col][0];   //create key : value 
                resrow.push(rescolumn);
              });   //inner column loop
              
              result.row.push(resrow);

            });     //rows loop
    return result;
}



//набор разрешенных в шаблоне функций
function selectsingle(collection, datetime, attributes, offset)
{
    //console.log(collection, datetime, attributes, precision, p5);
    return Math.random().toFixed(2);
}
