module.exports = (request) => {

    let date = new Date(request.date);
    
    request.row.forEach( function(item, i, arr) { 
        item.col.forEach( function(item, i, arr) {
        //console.log(item); 
        try{
            item._ =  eval(item._);
        }
        catch(err){
            return err;
        }
        });
    });
}

function SelectSingle(p1, p2, p3, p4, p5)
{
    console.log(p1, p2, p3);
    return 111;
}