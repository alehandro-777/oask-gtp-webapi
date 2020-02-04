const repository = require('./repository');
const ObjectId = require('mongodb').ObjectID;

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
// root:{row:[ [Object], [Object], [Object],.... ]}} => [{ col1: '12.23', col2: '6.3' }, ...] 
exports.estractMany = (xmlObject) => {

    let result = [];
  
    //обработка одиночных элементов
    let keys = xmlObject.row;   // – возвращает массив row.

    keys.forEach( function(xmlelm, i, arr) {

        let row = {};                

        //обработка каждой row      

        let columns = Object.keys(xmlelm);   // – возвращает массив ключей-columns.
            //обработка col
        columns.forEach( function(col, i, arr) {
                row[col] = xmlelm[col][0];   //create key : value 
            });   //inner column loop 
            result.push(row);
        });     //rows loop

    return result;
}

//add created_at and version
//  [{ col1: '12.23', col2: '6.3' }, ...] 
//return nothing
exports.add_created_version = (collection) => {

    collection.forEach( function(obj, i, arr) {
        obj["created_at"] = new Date().toISOString();
        obj["version"] = Number('1');
    });
 return collection;
}
//add updated_at and inc version
exports.add_uppdated_incversion = (collection) => {

    collection.forEach( function(obj, i, arr) {
        obj["updated_at"] = new Date().toISOString();
        obj["version"] = Number(obj["version"]) + Number('1');
    });
    return collection;
}
exports.remove_id = (collection) => {

    collection.forEach( function(obj, i, arr) {
        delete obj['_id'];            //immutable field _id !!!!!!!!!!!
    });
 return collection;
}

//[{ col1: '12.23', col2: '6.3' }, ...] => root:{row:[ [Object], [Object], [Object],.... ]}}

exports.formatToXmlFriendly = (collection) => {

    let result = {row:[]};

    collection.forEach( function(rowobj, i, arr) {
        let colArr = [];
        //обработка каждой col      
        let columns = Object.keys(rowobj);   // – возвращает массив ключей-columns.
        //обработка col
        columns.forEach( function(col, i, arr) {
            let cobj = {};

            if (col==="_id")
                cobj[col] = rowobj[col].toString();   //create key : value 
            else
                cobj[col] = rowobj[col];   //create key : value 

            colArr.push(cobj);
            });   //inner column loop 
        result.row.push(colArr);

        });     //rows loop

    return result;
}

//набор разрешенных в шаблоне функций
function selectsingle(collection, datetime, attributes, offset)
{
    //console.log(collection, datetime, attributes, precision, p5);
    return Math.random().toFixed(2);
}
