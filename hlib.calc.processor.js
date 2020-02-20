//MongoDb hlib data  collections names
const HOUR_COLL_NAME = 'HourHlData';
const INST_COLL_NAME = 'InstHlData';
const DAY_COLL_NAME = 'DayHlData';
const STAT_COLL_NAME = 'StatHlData';
const CORR_COLL_NAME = 'correctors';
const FL_COLL_NAME = 'flowlines';

const repository = require('./repository');
const domain = require('./model');


function getComlexLine(flowLine, coll, func, flolinecoll) {
    //привязка к физическому каналу - простая линия
    if (flowLine.chid) {
        //получить из архива ... значение        
        return repository.findOne(coll, {"flid": flowLine.flid});
    }
    //вычисление по формуле - сложная линия
    if (flowLine.cfgLines) {
        let promiseArr = [];
        flowLine.cfgLines.forEach(function(cfg) {
            //ищем вложенную линию по ид
            let vpromise = repository.findOne(flolinecoll, {"flid": cfg.flid}).then(fline => {
                //console.log(fline);
                return getComlexLine(fline, coll, func, flolinecoll)});

            promiseArr.push(vpromise);
        });        
        return Promise.all(promiseArr).then(values => {return func(flowLine.cfgLines, values)});
    };
    //линия не привязана к данным
    return null;
};

function processInstant(cfg, values){
    //instant
    let totalQ = 0;
    let totalcdQ = 0;
    let totalP = 0;
    let totalT = 0;
    let totaldp = 0;
    let maxTime = values[0].lastupdate;
    let activeCount = 0;
    let leadP;
    let leadT;
    let leaddp;

    for(let i = 0; i < cfg.length; i++){
   
        if (!values[i]) continue;

            if( cfg[i].leadPt ) {                
                leadP = values[i].p;
                leaddP = values[i].dp;
                leadT = values[i].t;
            }
    
            //console.log(mp);

            if(values[i].q > 0){
                activeCount++;
                totalQ = totalQ + cfg[i].koef * values[i].q;
                totalcdQ = totalcdQ + cfg[i].koef * values[i].currday;

                totalP += values[i].p;
                totalT += values[i].t;
                totaldp += values[i].dp;               

                if( !maxTime || values[i].lastupdate > maxTime ){
                    maxTime =  values[i].lastupdate;
                }
                //console.log(totalQ);
            }
    }
    
    let avgP = totalP / activeCount;
    let avgT = totalT / activeCount;
    let avgdp = totaldp / activeCount;

    let result = new domain.InstantFlowData();

    //установлен признак "брать Р или Т по отдельной линии"
    if( leadP ) {
        result.p = leadP;
        result.t = leadT;
        result.dp = leaddp;
    }
    //брать Р или Т average
    else {
        result.p = avgP;
        result.t = avgT;
        result.dp = avgdp;
    }

    result.q = totalQ;
    result.currday = totalcdQ;
    result.lastupdate = maxTime;
    result.quality = 192;

    return result;
}

function processIntegral(cfg, values){
    let totalQ = 0;
    let totalP = 0;
    let totalT = 0;
    let totaldp = 0;

    let maxTime = values[0].start;  //формируется срез по 1 элементу

    let activeCount = 0;
    let leadP = null;
    let leadT = null;
    let leaddp = null;

    for(let i = 0; i < cfg.length; i++){
   
            if( cfg[i].leadPt ) {                
                leadP = values[i].p;
                leaddP = values[i].dp;
                leadT = values[i].t;
            }
    
            //console.log(mp);

            if(values[i].q > 0 && values[i].start === maxTime){
                activeCount++;
                totalQ = totalQ + cfg[i].koef * values[i].q;

                totalP += values[i].p;
                totalT += values[i].t;
                totaldp += values[i].dp;               

            }
            else{
                return null;
            }
    }
    
    let avgP = totalP / activeCount;
    let avgT = totalT / activeCount;
    let avgdp = totaldp / activeCount;

    let result = new domain.IntegralFlowData();

    //установлен признак "брать Р или Т по отдельной линии"
    if( leadP ) {
        result.p = leadP;
        result.t = leadT;
        result.dp = leaddp;
    }
    //брать Р или Т average
    else {
        result.p = avgP;
        result.t = avgT;
        result.dp = avgdp;
    }

    result.q = totalQ;
    result.start = values[0].start;  //формируется срез по 1 элементу
    result.end = values[0].end;     //формируется срез по 1 элементу

    result.quality = 192;

    return result;
}

function processStat(cfg, values){
    //instant
    let totalCO2 = 0;
    let totalN2 = 0;
    let totalRo = 0;
    let maxTime = values[0].lastupdate;
    let activeCount = 0;
    let leadCO2;
    let leadN2;
    let leadRo;
   
    for(let i = 0; i < cfg.length; i++){
   
        if( cfg[i].leadStat ) {                
            leadCO2 = values[i].co2;
            leadN2 = values[i].n2;
            leadRo = values[i].ro;
        }

        //console.log(mp);

        if(values[i].q > 0){
            activeCount++;

            totalCO2 += values[i].co2;
            totalN2 += values[i].n2;
            totalRo += values[i].ro;

            if( !maxTime || values[i].lastupdate > maxTime ){
                maxTime =  values[i].lastupdate;
            }
            //console.log(totalQ);
        }
}

    let avgCO2 = totalCO2 / activeCount;
    let avgN2 = totalN2 / activeCount;
    let avgRo = totalRo / activeCount;

   
    let result = new domain.StatFlowData();

     //установлен признак "брать stat params по отдельной линии or average"
    if( leadCO2 ) {
        result.co2 = leadCO2;
        result.n2 = leadN2;
        result.ro = leadRo;
    }
    //брать Р или Т average
    else {
        result.co2 = avgCO2;
        result.n2 = avgN2;
        result.ro = avgRo;
    }

    result.q = totalQ;
    result.currday = totalcdQ;
    result.lastupdate = maxTime;
    result.quality = 192;

    return result;
}

exports.getlastDay = (flowLine)  => {};  //IntegralFlowData
exports.getcurrInst = (flowLine) => {};  //InstantFlowData
exports.getcurrStat = (flowLine) => {};  //StatFlowData

exports.gethistHour = (flowLine, query) => {};  
exports.gethistDay = (flowLine, query)  => {};
exports.gethistInst = (flowLine, query) => {};
exports.gethistStat = (flowLine, query) => {};

exports.getcurrValue = (flowLine)      =>   {};//RealTimeData
exports.gethistValue = (flowLine, query) => {};//RealTimeData
exports.gethourAvg = (flowLine, query)  =>  {};//RealTimeData
exports.getdayAvg = (flowLine, query)   =>  {};//RealTimeData

function test(){
    repository.findOne(FL_COLL_NAME, {"flid": 8}).then(
        result => {
            //console.log(result);
            getComlexLine(result, INST_COLL_NAME, processInstant, FL_COLL_NAME).then(
                result => {
                    console.log(result);
                },
                err =>{
                    console.log("ERROR->", err);
                }
            );
        });
}

test();