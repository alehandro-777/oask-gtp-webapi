XLSX = require('xlsx');
fs = require('fs');

const workbook = XLSX.readFile('test.xlsx');
let first_sheet_name = workbook.SheetNames[0];
var worksheet = workbook.Sheets[first_sheet_name];

XLSX.utils.sheet_add_json(worksheet, [
  { A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 0, H:11, I:23, J:234, K:"2021-12-01T12:00" }
], {header: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"], skipHeader: true, origin: -1});


let h = XLSX.utils.sheet_to_html(worksheet);

console.log(h);

fs.writeFile('test.html', h, function (err) {
  if (err) return console.log(err);
  console.log('html > test.html');
});

//console.log(h);