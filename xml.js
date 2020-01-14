var parseString = require('xml2js').parseString;
var xml = `
<root>element1

<row>element2
    <col>column2</col>
    <col>column2</col>
    <col>column2</col>
    <col>column2</col>
</row>
<row>element3
    <col>column3</col>
    <col>column3</col>
    <col>column3</col>
    <col>column3</col>
</row>
<row>element4</row>
<row>element5</row>

</root>`;
parseString(xml, function (err, result) {
    console.dir(result.root.row[0]);
});


var xml2js = require('xml2js');
var obj = {name: "Super", Surname: "Man", age: 23, fuck:{ $: {id: "my id"}, sss:"ass", aaa:"qqq"}, ara: ["sdfsgdsg","65753674367","hkhgjghj"]};
 
var builder = new xml2js.Builder();
var xml = builder.buildObject(obj);
console.dir(xml);