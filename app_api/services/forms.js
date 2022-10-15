const ValueLast = require('../models/value-last')
const Value = require('../models/value')
const Form = require('../models/form')
const Point = require('../models/db-point')

const SmartDate = require('../../smartdate')
const Func_serv = require('./function');
const Material = require('./materialisation');

exports.read = async (id, ts) => {
    let formCfg = await Form.findById(id).exec();
    let result = [];

    let {points, funcs} = ParseFormGonfig(formCfg);

    //чтение точек для формы
    let data = await ReadDbValues(points, ts);   

    result = [...data];

    data = await CalcFuncValues(funcs, ts);   

    result = [...result, ...data];

    return result;
}

//возвращает массив конфигураций точек из dbpoints для формы
exports.config = async (id) => {
    let formCfg = await Form.findById(id).exec();
    
    let {points, funcs} = await ParseFormGonfig(formCfg);

    let ids = points.map(e=> { return {"_id":e.point} });

    const data = await Point.find({ $or: ids }).populate("options func").exec();

    return data;
}

//запись массива значений при сохранении формы
exports.save = async (values, ts) => {
    let result = await Value.insertMany(values);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        await Material.update_last_value(value.point, ts);
        await Material.update_previous_value([value.point], ts);
    }
    return result;
}

exports.save1 = async (values) => {
    let result = await Value.insertMany(values);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        await Material.update_last_value(value.point, new Date(value.time_stamp) );
        await Material.update_previous_value([value.point], new Date(value.time_stamp) );
    }
    return result;
}
//чтение точек для формы
async function ReadDbValues(points, ts) {    
    const data = await ValueLast.aggregate([
        { $match: { $or: points, time_stamp: ts }}            
    ]);  
    return data;
}

//вызов функций для расчетных значений формы
async function CalcFuncValues(funcs, ts) {
let result = [];

    for (let i = 0; i < funcs.length; i++) {
        let data;        
        const func = funcs[i];

        //вызов функции по имени или Ид 
        if (func.short_name) {
            data = await Func_serv.call(func, ts);
        } else {
            data = await Func_serv.calc(func._id, ts);
        }
        result.push(data)
    }

    return result;

}


//разбор конфигурации формы результат в виде { points:[], funcs:[] }
// points: [ {point: point_id} ....
// funcs: [ { _id : func_id, short_name : .., params: [] ...

function ParseFormGonfig(formCfg) {
    let result = {
        points:[],
        funcs:[]
    };

    for (let i = 0; i < formCfg.rows.length; i++) {
        let row = formCfg.rows[i];        
        
        for (let j = 0; j < formCfg.columns.length; j++) {
            let column = formCfg.columns[j];
            let column_key = formCfg.columns[j].key;
            let column_type = formCfg.columns[j].type;

            if (column_type == "inputCol") {
                let point_id = row[column_key];
                if (point_id) result.points.push( {point:point_id} );
                continue;
            }
            if (column_type == "funcCol") {
                let func_id = row[column_key];
                if (func_id) {
                    let func = {};
                    func._id = func_id;
                    func.short_name = column.func_name;
                    func.params = [func_id];
                    result.funcs.push(func);
                }
            }
        }
    }
    return result;
}