const ExcelJS = require('exceljs');
const moment = require('moment'); // require
const fs = require('fs');
const fs_pro = require('fs').promises;

const LastValue = require('../models/value-last')
const PreviousValue = require('../models/value-previous')
const DbPoint = require('../models/db-point')

const SmartDate = require('../../smartdate')
const Func_serv = require('./function')
const Query_serv = require('./query')
const numeral = require('numeral');


function hexToRgbA(hex) {
    if (!hex) return "";
    const [a, r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgb(${r},${g},${b})`;   // rgb ONLY !! TODO
}

//{ top: 3, left: 3, bottom: 4, right: 3, sheetName: undefined }
function getHtmlTableSpans(range) {
    let result ="";
    if (!range) return "";

    let col = range.model.right - range.model.left;
    let row = range.model.bottom - range.model.top;

    if (col > 0) result = result + ` colspan="${col+1}"`
    if (row > 0) result = result + ` rowspan="${row+1}"`

    return result;
}

function ExcelToHtmlStyle(style) {
       
    //console.log(style)

      if (Object.keys(style).length === 0) return "";
  
      let bc = style.fill.fgColor ? "background-color:" + hexToRgbA(style.fill.fgColor.argb) + ";":"";
      let bold = style.font.bold ? "font-weight: bold;":""; 
      let fs = style.font.size ? `font-size: ${style.font.size}px;`:""; //removed ! - bad looks on html

      return `style="${bc}${bold}border: 1px solid #dddddd;"`;
}

function GetBackgroundColor(style) {
    if (Object.keys(style).length === 0) return "";
    return style.fill.fgColor ? hexToRgbA(style.fill.fgColor.argb) : "";
}

function GetFontWeight(style) {
      if (Object.keys(style).length === 0) return "";
      return style.font.bold ? 'bold' : '';
}

function GetCellWidth(cellwidth) {
    if (cellwidth) {
        let tmp = Math.ceil(cellwidth * 7 ); // ????????
        let htmlwidth = `${tmp}px`;        
        return htmlwidth;           //TODO TODO    
    } else {
        return "75px";
    }    
}

function getCellValue(cell) {
    //console.log(cell._column.width)
    //if set -> cell._column.width = 19.423 - float number or default = undefined 

    let style = ExcelToHtmlStyle(cell.style);
    let merges = cell._row._worksheet._merges;
    let currCell = cell._value.address;
    let range = merges[currCell];
    let span = getHtmlTableSpans(range);
    let background = GetBackgroundColor(cell.style);
    let font = GetFontWeight(cell.style);
    let width = GetCellWidth(cell._column.width);

    let result = {
        col:cell._column._number, //1...
        row: cell._row._number, //1...
        style: style,
        cell: currCell,
        span: span,
        bind: cell.value,
        format: cell.numFmt,
        width: width,
        bc: background,
        fw: font,
        cw:cell._column.width
    };

    return result;
}

function setCellValue(cell) {
    return cell.value = value;
}

function Sheet2HtmlTableHeader(ws, headRowsNum) {
    let html = "";
        
    //each cell callback
    let onEachCell = (cell, colNumber) => {
          
      //console.log(colNumber, cell )

      let merges = cell._row._worksheet._merges;
      let currCell = cell._value.address;
      let range = merges[currCell];
      let span = getHtmlTableSpans(range);

      //sticky column
      let cls = (colNumber == 1) ? `class="freeze"` : "";              
      let cls1 = (colNumber == 1) ? "freeze" : "";
      if (cell._value.model.type === 0) {
          //empty cell
          html = html + `<th ${span} class="empty-cell ${cls1}"> &nbsp;</th>`;

      } else if (cell._value.model.type === 1) {                
          //merged cell - don't need <td> 
      } else {
          //console.log(cell.style, style)
          html = html + `<th ${span} ${cls}>`;
          let value = cell.value;
          html = html + value + "</th>";
      }
    };

    //each row callback
    let onEachRow = (row, rowNumber) => {

      if (rowNumber > headRowsNum) return;

      html = html + "<tr>";
      row.eachCell({ includeEmpty: true }, onEachCell);
      html = html + "</tr>";

    };

    // Iterate over all rows (including empty rows) in a worksheet
    ws.eachRow({ includeEmpty: true }, onEachRow);
   
    return html;
}

function Sheet2Template(ws, headRowsNum) {
    let table = [];

    //each row callback
    let onEachRow = (row, rowNumber) => {
        //---------------------------
            //each cell callback
            let onEachCell = (cell, colNumber) => {
                //cell._row._number
                //cell._address
                //console.log(colNumber, rowNumber  )

            if (cell._value.model.type === 0) {
                //this is empty cell
            } else if (cell._value.model.type === 1) {                
                //this is merged cell - don't need <td> 
            } else {          
                let value = getCellValue(cell);
                new_row.push(value);
              }
            };        
        //---------------------------

        if (rowNumber <= headRowsNum) return;   //skip header

        let new_row = [];
        
        row.eachCell({ includeEmpty: true }, onEachCell);  

        table.push(new_row);

    };

    // Iterate over all rows (including empty rows) in a worksheet
    ws.eachRow({ includeEmpty: true }, onEachRow);

    return table;
}

//loop congig cells, add service fiels (control type "input" or "text")
function addControlType(table) {

    table.forEach(row => {
        row.forEach(col => {
            if (typeof col.bind == "number") {
                //db point edit
                //isInteger ->create html input to edit point values
                col["point"] =  col.bind;   //TODO
                col["type"] =   "input";
            } else {
                col["type"] =   "text";                            
            }
        });    
    });

    return table;
}

//add db points attributes
async function addDbPointsAttr(table)  {
    const point_ids = [];
    table.forEach(row => {
        row.forEach(col => {
            if ( col.type == 'input') {
                point_ids.push( col.point );
            }
        });            
    });    
    const point_cfg_arr = await DbPoint.find({_id:{$in: point_ids}});
    table.forEach(row => {
        row.forEach(col => {
            if ( col.type == 'input') {
                let point = point_cfg_arr.find(p=>p._id == col.point)
                col["min"] = point.min;
                col["max"] = point.max;
                col["step"] = point.step;
                col["func"] = point.func;
                col["html"] = point.type;
                col["fixed"] = point.fixed;
            }
        });            
    });
    return table;
}

//add fixed attr on first column 
async function addFixed(table)  {
    table.forEach(row => {
        row.forEach( (col, i) => {
            if (i==0) {
                col["freeze"] = true;
            }
        });            
    });    
    return table;
}
//=============================================================================

// select filter: [ { point: 4 }, { point: 5 }, { point: 6 } ]
function filterInputPoints(table) {
    const result = [];

    table.forEach(row => {
        row.forEach(col => {
            if ( col.type == 'input') {
                result.push({ point: col.point });
            }
        });            
    });    
    return result;
}

//aggregate functions
//Func Ids array [ 3, ... ]
function filterFunctions(table) {
    const result = [];
    table.forEach(row => {
        row.forEach(col => {
            if ( col.type == 'text' && col.bind.startsWith("@")) {
                let func_id = Number(col.bind.substring(1));
                result.push(func_id);
            }
        });            
    });    
    return result;
}

//Query Ids [ 1, ... ]
function filterQueries(table) {
    const result = new Set();
    table.forEach(row => {
        row.forEach(col => {
            if ( col.type == 'text' && col.bind.startsWith("$")) {
                //configured query ex. $23.2
                let parts = col.bind.substring(1).split(".");
                if (parts.length != 2) return;
                let obj = Number(parts[0]);
                let par = Number(parts[1]);
                if (obj && par) result.add( obj );
            }
        });            
    });    
    return Array.from( result.values() );
}

//Objects Map 1 => [ { point: 1 }], 2 => [ { point: 4 }, ... ] Func=> [ points ]
function filterObjects(table) {
    const result = new Map();
    table.forEach(row => {
        row.forEach(col => {            
            if ( col.type == 'text') {
                let parts = col.bind.split(".");
                
                if (parts.length != 2) return;

                let obj = Number(parts[0]);
                let par = Number(parts[1]);
                
                if (!obj) return;
                if (!par) return;

                if (!result.has(par) ) {
                    result.set(par, []);    
                }

                result.get(par).push({ point: obj });                
            }
        });            
    });    
    return result;
}

// {_id: 2022-07-01T04:00:00.000Z,  '4': 0, '5': 0, '6': 0 }
//select and pivot  keys-values
async function select_lastdb_pivot(points, begin, end) {
    const data = await LastValue.aggregate([
        { $match: { $or: points, time_stamp: { $lt: end, $gte: begin }} },
        { $group: { _id: "$time_stamp", 
            values: { $addToSet : {point: {$toString: "$point"}, value:"$value"} }, } },
        { $project:{tmp:{$arrayToObject: 
            {$zip:{inputs:["$values.point", "$values.value"]}}}}
        },
        { $addFields: {"tmp._id":"$_id"} },
        { $replaceRoot:{newRoot:"$tmp"} },
        { $addFields: { "#1": { $dateToString: { format: "%d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },           
        { $addFields: { "#2": { $dateToString: { format: "%H:%M", date: "$_id", timezone: "Europe/Kiev" } } } },
        { $addFields: { "#3": { $dateToString: { format: "%H:%M %d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },
        { $addFields: { "_id": { $toString: "$_id" } } },
        { $sort: { _id:1 } }
    ]);            
    return data;
}

async function aggregates(points, begin, end) {

    const data = await LastValue.aggregate([
        { $match: { $or: points, time_stamp: { $lt: end, $gte: begin }} },
        { $group: { _id: "$point", 
                    count: {$sum: 1}, 
                    avg: {$avg: "$value"},
                    sum: {$sum: "$value"},
                    max: {$max: "$value"},
                    min: {$min: "$value"},
                    begin: {$min: "$time_stamp"},
                    end: {$max: "$time_stamp"}
                }  
        },
        { $addFields: { ts_parts: { $dateToParts: { date: "$begin", timezone:"Europe/Kiev" } } } },          
        { $addFields: { local_dd_mm_yyyy: { $dateToString: { format: "%d.%m.%Y", date: "$begin", timezone: "Europe/Kiev" } } } },           
        { $addFields: { local_hh_mm: { $dateToString: { format: "%H:%M", date: "$begin", timezone: "Europe/Kiev" } } } }
    ]);            
    return data;
}

async function sum_aggregate(points, begin, end, func_suffix) {

    const data = await LastValue.aggregate([
        { $match: { $or: points, time_stamp: { $lt: end, $gte: begin }} },
        { $group: { _id: "$point", value: {$sum: "$value"} } },
        { $addFields: {"point":"$_id"} },
        { $addFields: {"time_stamp": end } },
        { $group: { _id: "$time_stamp", 
            values: { $addToSet : {point: {$concat: [{$toString: "$point"}, func_suffix]}, value:"$value"} }, } },
        { $project:{tmp:{$arrayToObject: 
            {$zip:{inputs:["$values.point", "$values.value"]}}}}
        },
        { $replaceRoot:{newRoot:"$tmp"} },
        { $addFields: { "_id": { $toString: end } } },
    ]);            
    return data;
}

async function summ_from1_aggregate(points, begin, end, func_suffix) {
    let begin_ = new SmartDate(end).currGasDay().firstMonthDay().dt;
    return await sum_aggregate(points, begin_, end, func_suffix)
}

async function avg_aggregate(points, begin, end, func_suffix) {
    const data = await LastValue.aggregate([
        { $match: { $or: points, time_stamp: { $lt: end, $gte: begin }} },
        { $group: { _id: "$point", value: {$avg: "$value"} } },
        { $addFields: {"point":"$_id"} },
        { $addFields: {"time_stamp": end } },
        { $group: { _id: "$time_stamp", 
            values: { $addToSet : {point: {$concat: [{$toString: "$point"}, func_suffix]}, value:"$value"} }, } },
        { $project:{tmp:{$arrayToObject: 
            {$zip:{inputs:["$values.point", "$values.value"]}}}}
        },        
        { $replaceRoot:{newRoot:"$tmp"} },
        { $addFields: { "_id": { $toString: end } } },
    ]);             
    return data;
}


//срез текущее состояние по дискрет объектам 
async function pointsCurrStates (points, ts, func_suffix) {
    const data = await LastValue.aggregate([
        { $match: { $or: points, time_stamp: { $lte: ts }} },
        { $sort: { time_stamp:1 } },
        { $group: { _id: "$point", 
                    point: {$last: "$point"},
                    value: {$last: "$value"},
                    state: {$last: "$state"},
                    time_stamp: {$last: "$time_stamp"},
                }  
        },
        //{$concat: [{$toString: "$point"}, func_suffix]}
        { $addFields: { "_id": { $toString: ts } } },
        { $group: { _id: "$_id", 
            states: { $addToSet : 
            {
                point: {$concat: [{$toString: "$point"}, func_suffix]}, 
                state:"$state"
            } }, } 
        },
        { $project:{tmp:
            {
                $arrayToObject: {$zip:{inputs:["$states.point", "$states.state"]}}
            }} 
        },        
        { $addFields: {"tmp._id":"$_id"} },
        { $replaceRoot:{newRoot:"$tmp"} },
    ]);            
    return data;
}
//срез дата/время последнего изменения состояние по дискрет объектам 
async function pointsLastStatesDateTime (points, ts, func_suffix) {
    const data = await LastValue.aggregate([
        { $match: { $or: points, time_stamp: { $lte: ts }} },
        { $sort: { time_stamp:1 } },
        { $group: { _id: "$point", 
                    point: {$last: "$point"},
                    value: {$last: "$value"},
                    state: {$last: "$state"},
                    time_stamp: {$last: "$time_stamp"},
                }  
        },
        //{$concat: [{$toString: "$point"}, func_suffix]}
        { $addFields: { "_id": { $toString: ts } } },
        { $group: { _id: "$_id", 
            states: { $addToSet : 
            {
                point: {$concat: [{$toString: "$point"}, func_suffix]}, 
                state: { $dateToString: { format: "%H:%M %d.%m.%Y", date: "$time_stamp", timezone: "Europe/Kiev" } }
            } }, } 
        },
        { $project:{tmp:
            {
                $arrayToObject: {$zip:{inputs:["$states.point", "$states.state"]}}
            }} 
        },        
        { $addFields: {"tmp._id":"$_id"} },
        { $replaceRoot:{newRoot:"$tmp"} },
    ]);            
    return data;
}

async function pointsStatesByPeriod(points, begin, end, step_min, step_number, func_suffix, func) {
    let result = [];
    let exec_day = new Date(begin);
    let _end = end;

    if (!_end) {
        _end = new Date( begin.getTime() + step_number * step_min * 60 * 1000);
    }
    while (exec_day.getTime() < _end.getTime()) {
            let data = await func(points, exec_day, func_suffix);
            //console.log(data)
            result = [...result, ...data];
        exec_day = new Date(exec_day.getTime() + step_min * 60 * 1000);
    }
    return result;
}


//--------------------------------------------------------------------------------

async function previous_values(points, begin, end, func_suffix) {
    const data = await PreviousValue.aggregate([
        { $match: { $or: points, time_stamp: { $lt: end, $gte: begin }} },
        { $group: { _id: "$time_stamp", 
            values: { $addToSet : {point: {$concat: [{$toString: "$point"}, func_suffix]}, value:"$value"} }, } },
        { $project:{tmp:{$arrayToObject: 
            {$zip:{inputs:["$values.point", "$values.value"]}}}}
        },
        { $addFields: {"tmp._id":"$_id"} },
        { $replaceRoot:{newRoot:"$tmp"} },
        { $addFields: { "_id": { $toString: "$_id" } } },
        { $sort: { _id:1 } }
    ]);            
    return data;
}

async function exec_funcS_every_step(array_ids, begin, end, step_min, step_number) {
    let result = [];
    for (let i = 0; i < array_ids.length; i++) {
        const id = array_ids[i];
        let tmp = await exec_func_every_step(id, begin, end, step_min, step_number);
        result = [...result, ...tmp];        
    }
    return result;
}

//function has '@..' prefix intemplate
async function exec_func_every_step(id, begin, end, step_min, step_number) {
    let result = [];
    let exec_day = new Date(begin);
    let _end = end;

    if (!_end) {
        _end = new Date( begin.getTime() + step_number * step_min * 60 * 1000);
    }
    while (exec_day.getTime() < _end.getTime()) {
            let data = await Func_serv.calc(id, exec_day);
            //console.log(data)
            let val = {};
            let key = "@" + id;
            val["_id"] = exec_day.toISOString();
            val[key] = data.value;
            result.push(val);

        exec_day = new Date(exec_day.getTime() + step_min * 60 * 1000);
    }

    return result;
}

async function exec_query(query_ids, begin, end) {
    let result = [];     
    for (let i = 0; i < query_ids.length; i++) {
        const id = query_ids[i];
        let q_result = await Query_serv.exec(id, begin, end);
        let data = transformQueryResult(id, q_result);
        result = [...result, ...data];
    }
    //console.log(result)   
    return result;
}

//query has '$..' prefix intemplate '$34.5' query 34 point 5
//query retuns result like 
//[ { '3': 0, '6': 0, '4': 0, _id: 2022-07-31T04:00:00.000Z } ]
//-> transform to [ { '$34.3': 0, '$34.6': 0, '$34.4': 0, _id: 2022-07-31T04:00:00.000Z }
function transformQueryResult(id, data) {
    let result = [];     
    data.forEach(row => {
        let new_row = {};
        for (const key in row) {
            //if number key - > transform '$34.3': 0,
            if (Number(key)) {
                new_row["$"+id+"."+key] = row[key];
            } else {
                new_row[key] = row[key];    
            }
            result.push(new_row);
        }
    });
    return result;
}

//
function exec_time_query(begin, end, step_min, step_number) {
    let result = [];
    let exec_day = new Date(begin);
    let _end = end;

    if (!step_min && !step_number) {
        return [];
    }

    if (!_end) {
        _end = new Date( begin.getTime() + step_number * step_min * 60 * 1000);
    }

    while (exec_day.getTime() < _end.getTime()) {
            //console.log(data);
            let val = {};
            val["_id"] = exec_day.toISOString();
            val["#1"] = moment(exec_day).format("DD.MM.YYYY");
            val["#2"] = moment(exec_day).format("HH:mm");
            val["#3"] = moment(exec_day).format("HH:mm DD.MM.YY");
            val["#4"] = exec_day.getHours();
            result.push(val);

        exec_day = new Date(exec_day.getTime() + step_min * 60 * 1000);
    }

    return result;
}


async function create_ds(begin, end, step_min, step_number, table)  {
    let result = [];

    let points = filterInputPoints(table);
    let f = filterFunctions(table);
    let q = filterQueries(table);
    let ob = filterObjects(table);

    //console.log(points);
    //console.log("Func", f);
    //console.log("Query", q);
    //console.log("id", id);
    //console.log("Objects", ob);
    if (points.length > 0) {
        let data = await select_lastdb_pivot(points, begin, end);
        result = [...result, ...data];            
    }
    //parameter 1  sum_aggregate
    //parameter 2  avg_aggregate
    //parameter 3  from 1 month day aggregate
    //parameter 4  previous values
   
    //period summ aggregare
    let pnts = ob.get(1);
    if (pnts) {
        let data1 = await sum_aggregate( pnts, begin, end, "."+"1");
        result = [...result, ...data1];    
    }
    //period average aggregate
    pnts = ob.get(2);
    if (pnts) {
        let data2 = await avg_aggregate( pnts, begin, end, "."+"2");
        result = [...result, ...data2];    
    }
    //summ from 1 day of month
    pnts = ob.get(3);
    if (pnts) {
        let data3 = await summ_from1_aggregate( pnts, begin, end, "."+"3");
        result = [...result, ...data3];    
    }
    //previous values
    pnts = ob.get(4);
    if (pnts) {
        let data7 = await previous_values( pnts, begin, end, "."+"4");
        result = [...result, ...data7];
    }
    //digital states
    pnts = ob.get(5);
    //console.log(pnts)
    if (pnts) {
        let data8 = await pointsStatesByPeriod(pnts, begin, end, step_min, step_number, "."+"5", pointsCurrStates);
        result = [...result, ...data8];
    }
    //digital states change time
    pnts = ob.get(6);
    if (pnts) {
        let data9 = await pointsStatesByPeriod(pnts, begin, end, step_min, step_number, "."+"6", pointsLastStatesDateTime);
        result = [...result, ...data9];
    }

    //panorama select -2d .. d step 2h odd
    pnts = ob.get(7);
    if (pnts) {
        let _begin = new SmartDate(begin).currGasDay().addDay(-2).dt;
        let _end = new SmartDate(_begin).addDay(3).dt;  

        let time = exec_time_query(_begin, _end, 60, 72);

        time = time.filter(t => t["#4"] % 2 == 0);

        let data = await LastValue.aggregate([
            { $match: { $or: pnts, time_stamp: { $gte: _begin, $lt: _end }} },
            { $group: { _id: "$time_stamp", values: { $addToSet : {point: {$toString: "$point"}, value:"$value"} }, } },
            { $project:{tmp:{$arrayToObject: {$zip:{inputs:["$values.point", "$values.value"]}}}} },
            { $addFields: {"tmp._id":"$_id"} },
            { $replaceRoot:{newRoot:"$tmp"} },
            { $addFields: { "#1": { $dateToString: { format: "%d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },           
            { $addFields: { "#2": { $dateToString: { format: "%H:%M", date: "$_id", timezone: "Europe/Kiev" } } } },
            { $addFields: { "#3": { $dateToString: { format: "%H:%M %d.%m.%Y", date: "$_id", timezone: "Europe/Kiev" } } } },
            { $addFields: { "#4": { $hour: { date: "$_id", timezone: "Europe/Kiev"} } } },
            { $addFields: { "_id": { $toString: "$_id" } } },
            { $match: { "#4":{ $mod: [ 2, 0 ]} } },
            { $sort: { _id:1 } }
        ]);

        data = [...data, ...time];
        data = merge_ds(data);
        sort_ds(data);

        data.forEach((d, i)=>{
            const day = Math.floor(i/12);
            const key = `#H-${2-day}D`;
            d[key] = d["#2"];
            for (const key in d) {
                if (Number(key)) {
                    d[key+".7"] = d[key];
                    delete d[key];
                }
            }           
        });

        //console.log(data)

        result = [...result, ...data];
    }
    
//-----
    pnts = ob.get(8);
    if (pnts) {
        let _begin = new SmartDate(begin).currGasDay().addDay(-2).dt;
        let _end = new SmartDate(_begin).addDay(1).dt;
        let data = await sum_aggregate( pnts, _begin, _end, "."+"8");
        data.forEach(d=>{
            d["#D-2"] = "D-2";
        });
        result = [...result, ...data];    
    }
    pnts = ob.get(9);
    if (pnts) {
        let _begin = new SmartDate(begin).currGasDay().addDay(-1).dt;
        let _end = new SmartDate(_begin).addDay(1).dt;
        let data = await sum_aggregate( pnts, _begin, _end, "."+"9");
        data.forEach(d=>{
            d["#D-1"] = "D-1";
        });
        result = [...result, ...data];    
    }
    pnts = ob.get(10);
    if (pnts) {
        let _begin = new SmartDate(begin).currGasDay().dt;
        let _end = new SmartDate(_begin).addDay(1).dt;
        let data = await sum_aggregate( pnts, _begin, _end, "."+"10");
        data.forEach(d=>{
            d["#D-0"] = "D: " + moment(begin).format("DD/MM");
        });
        result = [...result, ...data];    
    }
//----

//-----
pnts = ob.get(11);
if (pnts) {
    let _begin = new SmartDate(begin).currGasDay().addDay(-2).dt;
    let _end = new SmartDate(_begin).addDay(1).dt;
    let data = await avg_aggregate( pnts, _begin, _end, "."+"11");
    data.forEach(d=>{
        d["#D-2"] = "D-2";
    });
    result = [...result, ...data];    
}
pnts = ob.get(12);
if (pnts) {
    let _begin = new SmartDate(begin).currGasDay().addDay(-1).dt;
    let _end = new SmartDate(_begin).addDay(1).dt;
    let data = await avg_aggregate( pnts, _begin, _end, "."+"12");
    data.forEach(d=>{
        d["#D-1"] = "D-1";
    });
    result = [...result, ...data];    
}
pnts = ob.get(13);
if (pnts) {
    let _begin = new SmartDate(begin).currGasDay().dt;
    let _end = new SmartDate(_begin).addDay(1).dt;
    let data = await avg_aggregate( pnts, _begin, _end, "."+"13");
    data.forEach(d=>{
        d["#D-0"] = "D: " + moment(begin).format("DD/MM");
    });
    result = [...result, ...data];    
}
//----


    let data4 = exec_time_query(begin, end, step_min, step_number);
    result = [...result, ...data4];

    let data5 = await exec_funcS_every_step(f, begin, end, step_min, step_number);
    result = [...result, ...data5];

    let data6 = await exec_query(q, begin, end);
    result = [...result, ...data6];

    

    return result;
}

function map_template(template, ds) {
    let result = [];
    
    template.forEach(row => {
        //many rows 
        if ( row[0].type == "text" && row[0].bind.startsWith("#") ) {
            let row_set = map_row_multiply(row, ds);               
            result = [...result, ...row_set];
            //console.log(result)
            return;
        }

        let row_set = map_single_row(row, ds);  
        result = [...result, ...row_set];
    });    
    return result;
}

//multiply rows
function map_row_multiply(row_template, ds) {
    //console.log(row_template, ds)
    let result = [];

    //filter rows that have #xxx field
    let rows_with_ids = ds.filter(r=> row_template[0].bind in r);
    
    //console.log(rows_with_ids)

    rows_with_ids.forEach( (data_row, i) => {
        //deep clone row (array of objects)
        let new_row = JSON.parse(JSON.stringify(row_template));
        bind_row(data_row, new_row);
        result.push(new_row);
    });
    return result;    
}

function map_single_row(row_template, ds) {
    //console.log(row_template, ds)
    let result = [];

    //clone row
    let new_row = [...row_template];
    //filter rows that have _ids

    ds.forEach(data_row => {
        new_row.forEach( (col,i) => {
          if (col.bind in data_row) {
              //numeral(cell.value).format(fmt);
            col["value"] = data_row[col.bind];
            col["time_stamp"] = data_row["_id"];
            if (col.format && col.type == "text" && isFinite(Number(data_row[col.bind]))) {
                col["value"] = numeral(data_row[col.bind]).format(col.format);
            }
            //console.log(col.format, col["value"])
          }
          //костыль.. считаю что 1 колонка - всегда индекс
          if (i==0) {
            col["value"] = col.bind;
          }
       }); 
    });            

    result.push(new_row);
    return result;
}

//megre objects with same _ids (ds - array of objects)
//_id - typeof == "string" !!!
function merge_ds(ds) {
    const temp_map = new Map();
    let result = [];    

    ds.forEach(data_row => {
        if (data_row._id) {
            if (!temp_map.has(data_row._id)) {
                temp_map.set(data_row._id, {});
            }
            let tmp = temp_map.get(data_row._id);
            tmp = {...tmp, ...data_row};
            temp_map.set(data_row._id, tmp);
        } else {
            result.push(data_row);
        }  
    });

    let tmp = Array.from(temp_map.values());
    result = [...result, ...tmp];
    return result;
}

function sort_ds(ds) {
    return ds.sort( (a,b)=> {
        if ( a._id < b._id ){
            return -1;
          }
          if ( a._id > b._id ){
            return 1;
          }
          return 0;
    } );
}

function bind_row(data_row, template_row) {
    //console.log(data_row, template_row)
    template_row.forEach(col => {
        //numeral(cell.value).format(fmt);
        col["value"] = data_row[col.bind];
        col["time_stamp"] = data_row["_id"];
        if (col.format && col.type == "text" && isFinite(Number(data_row[col.bind]))) {
            col["value"] = numeral(data_row[col.bind]).format(col.format);
        }
    });                
}

async function xlsx_export(rows, workbook, ws, filename) {
    let insert_counter = 0;
    let last_row;

    rows.forEach((row,i) => {          
      let current_row = row[0].row + insert_counter;
        if(current_row == last_row) {
            ws.duplicateRow(current_row, 1, true); //true if you want to insert new rows for the duplicates
            insert_counter++;
            current_row++;
        }
        
      row.forEach( (col,j) => {            
        let cell = ws.getRow(current_row).getCell(col.col);
        cell.value = col.value;
        //console.log(cell.address, col.value)
      });
      last_row = current_row;
    });

    await workbook.xlsx.writeFile(filename);
    const stream = fs.createReadStream(filename);

    return stream;
}

async function create_rows(cfg, begin, end) {
    let _end;

    if ( end instanceof Date && !isNaN(end)) {
        _end = end;
    } else {
        _end = new Date( begin.getTime() + cfg.step * 60 * 1000 * cfg.length );        
    }

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(cfg.template);
    let ws = workbook.worksheets[cfg.sheet]; //the first one;

    let table = Sheet2Template(ws, cfg.headSize);
    
    // text or input
    addControlType(table);
    //add html input attributes
    await addDbPointsAttr(table);
    addFixed(table);

    let data_set = await create_ds(begin, _end, cfg.step, cfg.length, table);
    data_set = merge_ds(data_set);
    sort_ds(data_set);

    //await fs_pro.writeFile('json/dataset.json', JSON.stringify(data_set) );
    //console.log(data_set)

    let rows = map_template(table, data_set)

    //console.log(rows.length)
    //console.log(rows)
    
    //console.log(data)
    //console.log(table)
    return rows;

}

async function create_xlsx(cfg, begin, end) {
    let _end;

    if ( end instanceof Date && !isNaN(end)) {
        _end = end;
    } else {
        _end = new Date( begin.getTime() + cfg.step * 60 * 1000 * cfg.length );        
    }
    
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(cfg.template);
    let ws = workbook.worksheets[cfg.sheet]; //the first one;

    let template = Sheet2Template(ws, cfg.headSize);
    
    // text or input
    addControlType(template)

    let data_set = await create_ds(begin, _end, cfg.step, cfg.length, template);
    data_set = merge_ds(data_set);
    sort_ds(data_set);

    //console.log(data_set)

    let rows = map_template(template, data_set)

    //console.log(rows.length)
    //console.log(rows)
    
    return await xlsx_export(rows, workbook, ws, "xls/test1.xlsx");
}


//----------------------------------------------------------------------------------------
exports.create = async (cfg, begin, end) => {
    return await create_rows(cfg, begin, end)
}

exports.create_xlsx = async (cfg, begin, end) => {
    return await create_xlsx(cfg, begin, end)
}

exports.create_table_header = async (cfg) => {
    
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(cfg.template);
    let ws = workbook.worksheets[cfg.sheet]; //the first one;

    let html = Sheet2HtmlTableHeader(ws, cfg.headSize);

    //console.log(html)
    return html;
}

