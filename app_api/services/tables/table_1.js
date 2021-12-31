const ValueService = require('../valuesService')
const config = require('./config1.json')
const SmartDate = require('../../../smartdate')
const XLSX = require('xlsx');
const config1 = require('./config.json')
const fs = require('fs');

class TableService {
    constructor (serv, xls, fs) {
        this.valueService = serv;
        this.XLSX = xls;
        this.fs = fs;
    }

    createFooter( footColumns, columnFuncs, table) {
        let footer = {};

        footer.class = "total"; // ???

        for (let j = 0; j < footColumns.length; j++) {
            const column = footColumns[j];
            
            footer[column.key] = columnFuncs[column.key]( table );
        }
        return footer;
    }

    createFixedRowSet(sourceRows, columns, columnFuncs) {
        let resultTable = [];        

        for (let i = 0; i < sourceRows.length; i++) {
            let currentRow = {};
            currentRow.k = sourceRows[i].k || 1;

            for (let j = 0; j < columns.length; j++) {
                const column = columns[j];                               
                currentRow[column.key] = columnFuncs[column.key]( sourceRows[i], column.key, currentRow, resultTable );
            }
            resultTable.push(currentRow);
        }
        return resultTable;
    }

    async compileGETsFunctions(gasDay, cfgArray) {
        let columnFuncs = {};
        for (let i = 0; i < cfgArray.length; i++) {
            let c = cfgArray[i];
            let expression = `this.${c.func}(c.params, new Date(gasDay))`;
            columnFuncs[c.key] = await eval(expression);
        }
        return columnFuncs;
    }

//--------- COLUMN FUNCTIONS -------------    
    async text(params, gasday) {
        function getValue(sourceRow, columnkey, currentRow, resultTable) {
            return sourceRow[columnkey];
        }
        return getValue;
    }

    async select(params, gasday) {
        let data = [];
        data = await this.valueService.selectRow(params, gasday);

        function getValue(sourceRow, columnkey, currentRow, resultTable) {
            let value = data.find( v=> v._id.point == sourceRow[columnkey]);

            if (value) {
                return value.value;
            } else {
                return null;
            }            
        }
        return getValue;
    }

    async add(params, gasday) {
        let pars = params;
        function getValue(sourceRow, columnkey, currentRow, resultTable ) {
            return  pars.reduce( (acc, key) => acc + (currentRow[key]||0) , 0);
        }
        return getValue;
    }

    async sub(params, gasday) {
        let pars = params;

        function getValue(sourceRow, columnkey, currentRow, resultTable ) {
            return  (currentRow[pars[0]] || 0) - (currentRow[pars[1]] || 0);
        }
        return getValue;
    }

    async mul(params, gasday) {
        let pars = params;
        function getValue( sourceRow, columnkey, currentRow, resultTable ) {
            return  pars.reduce( (acc, key) => acc * (currentRow[key]||0) , 1);
        }
        return getValue;
    }

    async div(params, gasday) {
        let pars = params;
        function getValue( sourceRow, columnkey, currentRow, resultTable ) {
            return  (currentRow[pars[0]] || 0) / (currentRow[pars[1]] || 1);
        }
        return getValue;
    }

    async sum(params, gasday) {
        let pars = params;
        function getValue(table ) {

            let total = 0;
            if (table.length == 0) {
                return null;
            }
            for (let i = 0; i < table.length; i++) {                
                let row = table[i];
                let k = row["k"] || 1;            
                total = total + k * (row[pars[0]] || 0);

            }
            return total;
        }
        return getValue;
    }

    async avg(params, gasday) {
        let pars = params;
        function getValue(table ) {
            let total = 0;
            let nonNanCount =0;

            if (table.length == 0) {
                return null;
            }
            for (let i = 0; i < table.length; i++) {
                let row = table[i];
                if (row[pars[0]]) {
                    total = total + row[pars[0]];
                    nonNanCount++;
                }
            }
            return total / nonNanCount;
        }
        return getValue;
    }
    
    async textf(params, gasday) {
        let pars = params;
        function getValue(key) {
            return pars[0];
        }
        return getValue;
    }

    async map(params, gasday) {
        let pars = params;
        function getValue( sourceRow, columnkey, currentRow, resultTable ) {                                   
            return sourceRow[pars[0]];
        }
        return getValue;
    }
//--------- END COLUMN FUNCS


//--- TABLE SELECTORS
    async selectTableW(params, gasDay) {
        let end = new SmartDate(gasDay).nextGasDay().dt;
        let begin = new SmartDate(gasDay).firstMonthDay().dt;        
        let result;
        result = await  this.valueService.selectDtTable(params, begin, end);
        return result;        
    }
//---END TABLE SELECTORS


    async createExcelWorkBook(gasDay) {
        const wb = XLSX.readFile('test.xlsx');
        let sheet0_name = wb.SheetNames[0];
        let ws = wb.Sheets[sheet0_name];        

        let data = await this.createNotFixed(gasDay);        

        let excelRows = this.convert4html(data, config.columns);

        XLSX.utils.sheet_add_json(ws, excelRows, {header: Object.keys(excelRows[0]), skipHeader: true, origin: -1});
        
        const filename = "temp.xlsx";
        const wb_opts = {bookType: 'xlsx', type: 'binary'};   // workbook options
        XLSX.writeFile(wb, filename, wb_opts);                // write workbook file
    
        const stream = this.fs.createReadStream(filename);         // create read stream

        return stream;
    }
    
    //{ A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 0, H:11, I:23, J:234 }
    convert4html(rows, columns)  {
        let result = [];
        let map = { "#":"A","1":"B","2":"C","3":"D","4":"E","5":"F","6":"G","7":"H","8":"I","9":"J","10":"K","11":"L", 
            "12":"M", "13":"N", "14":"O", "15":"P", "16":"Q", "17":"R", "18":"S", "19":"T", "20":"U", "21":"V", "22":"W", 
            "23":"X", "24":"Y", "25":"Z", "26":"AA"
        };

        for (let i = 0; i < rows.length; i++) {
            let newRow = {};
            const row = rows[i];
            for (let j = 0; j < columns.length; j++) {
                const col = columns[j];
                let newKey = map[col.key];
                let currValue = row[col.key];
                let newValue = this.format(currValue, col);
                newRow[newKey] = newValue;
            }
            result.push(newRow);               
        }
        return result;
    }

    format(value, column)   {
        if (!value) return "";

        switch (column.type) {
            case "datetime":                
                return new Date(value).toLocaleString();
            case "number":
                return value.toFixed(column.dec);
            case "time":
                return new Date(value).toLocaleTimeString();
            case "date":
                return new Date(value).toLocaleDateString();
            default:
                return value;
        }
    }

    async createHtml(gasDay) {
        const wb = XLSX.readFile('test.xlsx');
        let sheet0_name = wb.SheetNames[0];
        let ws = wb.Sheets[sheet0_name];        

        let data = await this.createNotFixed(gasDay);        

        let excelRows = this.convert4html(data, config.columns);

        XLSX.utils.sheet_add_json(ws, excelRows, {header: Object.keys(excelRows[0]), skipHeader: true, origin: -1});        
        
        let html = XLSX.utils.sheet_to_html(ws);
        return html;
    }


    //TEST ONLY not fixed row set
    async createNotFixed(gasDay) {        

        let columnFuncs = {};
        let footerFuncs = {};

        let c = config.table;

        //select row set
        let expression = `this.${c.func}(c.params, new Date(gasDay))`;
        let rowset = await eval(expression);

        columnFuncs = await this.compileGETsFunctions(gasDay, config.columns);

        footerFuncs = await this.compileGETsFunctions(gasDay, config.footer);

        let table = this.createFixedRowSet(rowset, config.columns, columnFuncs);

        let footer = this.createFooter( config.footer, footerFuncs, table);

        table.push(footer);

        return table;  
    }

    //TEST ONLY !!! fixed row set
    async createFixed(gasDay) {            

        let table = [];        
        let columnFuncs = {};        

        let footerFuncs = {};        

        columnFuncs = await this.compileGETsFunctions(gasDay, config1.columns);
        footerFuncs = await this.compileGETsFunctions(gasDay, config1.footer);
    
        table = this.createFixedRowSet(config1.rows, config1.columns, columnFuncs);

        let footer = this.createFooter( config1.footer, footerFuncs, table);

        console.log(footer);
        table.push(footer);

        return table;
    }

}

module.exports = new TableService(ValueService, XLSX, fs);