const XLSX = require('xlsx');
const fs = require('fs');

const ExcelJS = require('exceljs');
const FormulaParser = require('hot-formula-parser').Parser;
const numeral = require('numeral');

// load a locale
numeral.register('locale', 'ua', {
  delimiters: {
      thousands: ' ',
      decimal: ','
  },
  abbreviations: {
      thousand: 'тис',
      million: 'млн',
      billion: 'млрд',
      trillion: 'трлн'
  },
  ordinal : function (number) {
      return number === 1 ? 'е' : 'й';
  },
  currency: {
      symbol: '₴'
  }
});

numeral.locale('ua');

class ExcelService {
    hexToRgbA(hex) {
        if (!hex) return "";
        const [a, r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgb(${r},${g},${b})`;   // rgb ONLY !! TODO
    }
    
    //{ top: 3, left: 3, bottom: 4, right: 3, sheetName: undefined }
    getHtmlTableSpans(range) {
        let result ="";
        if (!range) return "";
    
        let col = range.model.right - range.model.left;
        let row = range.model.bottom - range.model.top;
    
        if (col > 0) result = result + ` colspan="${col+1}"`
        if (row > 0) result = result + ` rowspan="${row+1}"`
    
        return result;
    }
    
    ExcelToHtmlStyle(style) {
       
      //console.log(style)

        if (Object.keys(style).length === 0) return "";
    
        let bc = style.fill.fgColor ? "background-color:" + this.hexToRgbA(style.fill.fgColor.argb) + ";":"";
        let bold = style.font.bold ? "font-weight: bold;":""; 
        let fs = style.font.size ? `font-size: ${style.font.size}px;`:""; //removed ! - bad looks on html

        return `style="${bc}${bold}border: 1px solid #dddddd;"`;
    }

    getValueText(parser, cell) {
      let fmt = cell.numFmt;
      
      if (typeof cell.value === 'number' && isFinite(cell.value)) {
        return numeral(cell.value).format(fmt);
      }

      if (cell.formula) {            
        return numeral(parser.parse(cell.formula).result).format(fmt);
      } 

      return cell.value;
    }
  

    getValue(parser, cell) {
      if (cell.formula) {            
        return parser.parse(cell.formula).result;
      } else {
        return cell.value;
      }
  }
  

    setCellValue(value, ws, cellLabel) {
    let fm = ws.getCell(cellLabel).formula;
    
    //console.log(ws.getCell(cellLabel).value)

      if (fm) {
          
        return  ws.getCell(cellLabel).value = { formula: fm, result: value };

      } else {
        return  ws.getCell(cellLabel).value = value ;
      }
    }
    
       setValue(value, cell) {
        let fm = cell.formula
        
        //console.log(cell.value)

        if (fm) {
            
          return  cell.value = { formula: fm, result: value };
    
        } else {
          return  cell.value = value ;
        }
      }
    
       Sheet2HtmlTable(parser, ws) {
        let html = "<table>";
        
        //each cell callback
        let cell_cb = (cell, colNumber) => {
              
          //console.log(rowNumber,colNumber, cell._value )

          let merges = cell._row._worksheet._merges;
          let currCell = cell._value.address;
          let range = merges[currCell];
          let span = this.getHtmlTableSpans(range);

          //empty cell
          if (cell._value.model.type === 0) {
              html = html + `<td ${span} class="empty-cell">&nbsp;</td>`;
          } else if (cell._value.model.type === 1) {                
              //merged cell - don't need <td> 
          } else {
              let style = this.ExcelToHtmlStyle(cell.style);
              //sticky column
              let cls = (colNumber == 1) ? `class="headcol"` : ""; 
                          
              //console.log(cell.style, style)             
              html = html + `<td ${span} ${style} ${cls}>`;
              let value = this.getValueText(parser, cell);
              html = html + value + "</td>";
          }
        };

        //each row callback
        let row_cb = (row, rowNumber) => {
          let cls = rowNumber == 1 ? `class="headrow"` : ""; 
          html = html + `<tr ${cls}>`;
          row.eachCell({ includeEmpty: true }, cell_cb);  
          html = html + "</tr>";
        };

        // Iterate over all rows (including empty rows) in a worksheet
        ws.eachRow({ includeEmpty: true }, row_cb);
    
        html = html + "</table>";
    
        return html;
      }
    
      Sheet2HtmlTableHeader(parser, ws, row_num) {
        let html = "";
        
        //each cell callback
        let cell_cb = (cell, colNumber) => {
              
          //console.log(rowNumber,colNumber, cell._value )

          let merges = cell._row._worksheet._merges;
          let currCell = cell._value.address;
          let range = merges[currCell];
          let span = this.getHtmlTableSpans(range);

          //empty cell
          if (cell._value.model.type === 0) {
              html = html + `<th ${span} class="empty-cell"> &nbsp;</th>`;
          } else if (cell._value.model.type === 1) {                
              //merged cell - don't need <td> 
          } else {

              //console.log(cell.style, style)             
              html = html + `<th ${span}>`;
              let value = this.getValue(parser, cell);
              html = html + value + "</th>";
          }
        };

        //each row callback
        let row_cb = (row, rowNumber) => {

          if (rowNumber > row_num) return;

          html = html + "<tr>";
          row.eachCell({ includeEmpty: true }, cell_cb);
  
          html = html + "</tr>";
        };

        // Iterate over all rows (including empty rows) in a worksheet
        ws.eachRow({ includeEmpty: true }, row_cb);
       
        return html;
      }
      
       SheetCalc(parser, ws) {
        
        //each cell callback
        let cell_cb = (cell, colNumber) =>{              
          //console.log(rowNumber,colNumber, cell._value )
          //empty cell
          if (cell._value.model.type === 0) {
              //skip
          } else if (cell._value.model.type === 1) {                
              //merged cell - skip  
          } else {              
              let value = this.getValue(parser, cell);
              this.setValue(value, cell);
          }
        };

        //each cell callback
        // Iterate over all rows (including empty rows) in a worksheet
        let row_cb = (row, rowNumber) =>{
          row.eachCell({ includeEmpty: true }, cell_cb);
        };

        ws.eachRow({ includeEmpty: true }, row_cb);
      }

      UpdateSheet(cells_set, ws) {
        for (let i = 0; i < cells_set.length; i++) {
            const cell = cells_set[i];
            this.setCellValue(cell.data, ws, cell.key);
        }
      }

      // hot-formula-parser for excel workSheet
      createFormulaParser(ws) {
          const parser = new FormulaParser();
        
          parser.on('callCellValue', function(cellCoord, done) {
            if (ws.getCell(cellCoord.label).formula) {
              done(parser.parse(ws.getCell(cellCoord.label).formula).result);
            } else {
              done(ws.getCell(cellCoord.label).value);
            }
          });

          parser.on('callRangeValue', function(startCellCoord, endCellCoord, done) {
            var fragment = [];

            for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
              var colFragment = [];

              for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
                colFragment.push(ws.getRow(row + 1).getCell(col + 1).value);
              }

              fragment.push(colFragment);
            }

            if (fragment) {
              done(fragment);
            }
          });

            return parser;
      }    


//--------------------------------------------------------------------------------------------------------  
      async  create(col_set, filename) {
          const workbook = new ExcelJS.Workbook();        
          await workbook.xlsx.readFile(filename);
          let ws = workbook.worksheets[0]; //the first one;
          const parser = this.createFormulaParser(ws);

          const temp_file = "xls/temp.xlsx";

          this.UpdateSheet(col_set, ws);
       
          //------------sheet additional info 
          workbook.creator = 'OASK PSG WEB API';
          //workbook.lastModifiedBy = 'OASK web api';
          workbook.created = new Date();
          //workbook.modified = new Date();
          //workbook.lastPrinted = new Date(2021, 7, 27);
          
          this.SheetCalc(parser, ws);

          await workbook.xlsx.writeFile(temp_file);
          const stream = fs.createReadStream(temp_file);

          return stream;
    }

    async  create_html(col_set, filename) {
      
      const workbook = new ExcelJS.Workbook();
     
      await workbook.xlsx.readFile(filename);
      let ws = workbook.worksheets[0]; //the first one;
      const parser = this.createFormulaParser(ws);

      this.UpdateSheet(col_set, ws);

      let html = this.Sheet2HtmlTable(parser, ws);
      //console.log(html)
      return html;
    }

    async  create_html_table_header(filename, row_num) {
      
      const workbook = new ExcelJS.Workbook();
     
      await workbook.xlsx.readFile(filename);
      let ws = workbook.worksheets[0]; //the first one;
      const parser = this.createFormulaParser(ws);

      let html = this.Sheet2HtmlTableHeader(parser, ws, row_num);
      //console.log(html)
      return html;
    }    
}

module.exports = new ExcelService();


