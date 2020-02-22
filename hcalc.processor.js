const flowline_repository = require('./repo/flowline.repo');
const correct_repository = require('./repo/correct.repo');
const ddata_repository = require('./repo/day.data.repo');
const hdata_repository = require('./repo/hour.data.repo');
const instdata_repository = require('./repo/inst.data.repo');
const stat_repository = require('./repo/stat.data.repo');

const domain = require('./model');

function getLastLineData(flowLine, datarepo, cfgrepo, pcocessfunc) {
    //привязка к физическому каналу - простая линия
    if (flowLine.chid) {
        //получить из архива ... значение        
        return datarepo.findLastUpdated({"flid": flowLine.flid});
    }
    //вычисление по формуле - сложная линия
    if (flowLine.cfgLines) {
        let promiseArr = [];
        flowLine.cfgLines.forEach(function(cfg) {
            //ищем вложенную линию по ид
            let vpromise = cfgrepo.findOne({"flid": cfg.flid}).then(fline => {
                //console.log(fline);
                return getLastLineData(fline, datarepo, cfgrepo, pcocessfunc)});

            promiseArr.push(vpromise);
        });        
        return Promise.all(promiseArr).then(values => {return pcocessfunc(flowLine.cfgLines, values)});
    };
    //линия не привязана к данным
    return null;
};

function getLineData(flowLine, datarepo, cfgrepo, pcocessfunc, datetime) {
    //привязка к физическому каналу - простая линия
    if (flowLine.chid) {
        //получить из архива ... значение        
        return datarepo.findOne({"flid": flowLine.flid, "lastupdate" : datetime});
    }
    //вычисление по формуле - сложная линия
    if (flowLine.cfgLines) {
        let promiseArr = [];
        flowLine.cfgLines.forEach(function(cfg) {
            //ищем вложенную линию по ид
            let vpromise = cfgrepo.findOne({"flid": cfg.flid}).then(fline => {
                //console.log(fline);
                return getLineData(fline, datarepo, cfgrepo, pcocessfunc, datetime)});

            promiseArr.push(vpromise);
        });        
        return Promise.all(promiseArr).then(values => {return pcocessfunc(flowLine.cfgLines, values)});
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
    let maxTime;
    let activeCount = 0;
    let leadP;
    let leadT;
    let leaddp;

    for(let i = 0; i < cfg.length; i++){
   
        if (!values[i]) continue;
        if (!maxTime) maxTime = values[i].lastupdate;

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

                if( values[i].lastupdate > maxTime ){
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
    result.childs = values;

    return result;
}

function processIntegral(cfg, values){
    let totalQ = 0;
    let totalP = 0;
    let totalT = 0;
    let totaldp = 0;

    let start;
    let end;

    let activeCount = 0;
    let leadP = null;
    let leadT = null;
    let leaddp = null;

    for(let i = 0; i < cfg.length; i++){

        if (!values[i]) continue;
        if (!start) start = values[i].start;
        if (!end) end = values[i].lastupdate;

            if( cfg[i].leadPt ) {                
                leadP = values[i].p;
                leaddP = values[i].dp;
                leadT = values[i].t;
            }

            if(values[i].q > 0){
                activeCount++;
                totalQ = totalQ + cfg[i].koef * values[i].q;
                totalP += values[i].p;
                totalT += values[i].t;
                totaldp += values[i].dp;               
            }
        if(values[i].lastupdate > end){
            start = values[i].start;
            end = values[i].lastupdate;
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
    result.start = start;
    result.lastupdate = end;
    result.quality = 192;
    result.childs = values;
    return result;
}

function processStat(cfg, values){
    //instant
    let totalCO2 = 0;
    let totalN2 = 0;
    let totalRo = 0;
    let maxTime;
    let activeCount = 0;
    let leadCO2;
    let leadN2;
    let leadRo;
   
    for(let i = 0; i < cfg.length; i++){

        if (!values[i]) continue;
        if (!maxTime) maxTime = values[i].lastupdate;

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

            if( values[i].lastupdate > maxTime ){
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
    result.childs = values;
    return result;
}

exports.getlastDay = (flowLineId)  => {
    return new Promise((resolve, reject) => {
        flowline_repository.findOne({"flid": flowLineId}).then(
            result => {
                //console.log(result);
                getLastLineData(
                    result, 
                    ddata_repository, 
                    flowline_repository, 
                    processIntegral)
                    .then(
                    result => {
                        resolve(result);
                    },
                    err =>{
                        reject(err);
                    }
                );
            });        
    });
};

exports.getlastHour = (flowLineId)  => {
    return new Promise((resolve, reject) => {
        flowline_repository.findOne({"flid": flowLineId}).then(
            result => {
                //console.log(result);
                getLastLineData(
                    result, 
                    hdata_repository, 
                    flowline_repository, 
                    processIntegral)
                    .then(
                    result => {
                        resolve(result);
                    },
                    err =>{
                        reject(err);
                    }
                );
            });        
    });
};

exports.getcurrInst = (flowLineId) => {
    return new Promise((resolve, reject) => {
        flowline_repository.findOne({"flid": flowLineId}).then(
            result => {
                //console.log(result);
                getLastLineData(
                    result, 
                    instdata_repository, 
                    flowline_repository, 
                    processInstant)
                    .then(
                    result => {
                        resolve(result);
                    },
                    err =>{
                        reject(err);
                    }
                );
            });        
    });

};

exports.getcurrStat = (flowLineId) => {
    return new Promise((resolve, reject) => {
        flowline_repository.findOne({"flid": flowLineId}).then(
            result => {
                //console.log(result);
                getLastLineData(
                    result, 
                    stat_repository, 
                    flowline_repository, 
                    processStat)
                    .then(
                    result => {
                        resolve(result);
                    },
                    err =>{
                        reject(err);
                    }
                );
            });        
    });
};  //StatFlowData

exports.gethistHour = (flowLineId, datetime) => {
    return new Promise((resolve, reject) => {
        flowline_repository.findOne({"flid": flowLineId}).then(
            result => {
                //console.log(result);
                getLineData(
                    result, 
                    hdata_repository, 
                    flowline_repository, 
                    processIntegral,
                    datetime)
                    .then(
                    result => {
                        resolve(result);
                    },
                    err =>{
                        reject(err);
                    }
                );
            });        
    });
};  

exports.gethistDay = (flowLineId, datetime)  => {
    return new Promise((resolve, reject) => {
        flowline_repository.findOne({"flid": flowLineId}).then(
            result => {
                //console.log(result);
                getLineData(
                    result, 
                    ddata_repository, 
                    flowline_repository, 
                    processIntegral,
                    datetime)
                    .then(
                    result => {
                        resolve(result);
                    },
                    err =>{
                        reject(err);
                    }
                );
            });        
    });
};


exports.gethistStat = (flowLine, query) => {};

exports.getcurrValue = (flowLine)      =>   {};//RealTimeData
exports.gethistValue = (flowLine, query) => {};//RealTimeData
exports.gethourAvg = (flowLine, query)  =>  {};//RealTimeData
exports.getdayAvg = (flowLine, query)   =>  {};//RealTimeData

function test(){
    
    exports.gethistDay(8, "2020-02-02T07:00").then(
        result => {
            console.log(result);
        },
        err =>{
            console.log("ERROR->", err);
        }        
    );
}

test();