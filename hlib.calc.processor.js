//MongoDb hlib data  collections names
const HOUR_COLL_NAME = 'HourHlData';
const INST_COLL_NAME = 'InstHlData';
const DAY_COLL_NAME = 'DayHlData';
const STAT_COLL_NAME = 'StatHlData';

const repository = require('./repository');

exports.getlastHour = (flowLine)  => {
    //привязка к физическому каналу
    if (flowLine.correctorChannelId) {
        //получить из базы значение
        return ;
    }
    //вычисление по формуле
    if (flowLine.cfgLines) {

        return
    };
    //линия не привязана к данным
    return null;
};  //IntegralFlowData

function processInstant(){
    //instant
    let totalQ = 0;
    let totalcdQ = 0;
    let totalP = 0;
    let totalT = 0;
    let totaldp = 0;
    let maxTime = new Date();
    let activeCount = 0;
    let leadP = null;
    let leadT = null;


    for (let calcLine of this.calcLines) {
   
        if (calcLine.enabled){

            if(calcLine.leadP) leadP = calcLine.point.currInst.p;
            if(calcLine.leadT) leadT = calcLine.point.currInst.t;
    
            //console.log(mp);

            if(calcLine.point.currInst.q > 0 && calcLine.add){
                activeCount++;
                totalQ += calcLine.point.currInst.q;
                totalP += calcLine.point.currInst.p;
                totalT += calcLine.point.currInst.t;
                totaldp += calcLine.point.currInst.dp;
                totalcdQ += calcLine.point.currInst.currday;

                if(calcLine.point.currInst.lastupdate > maxTime){
                    maxTime =  calcLine.point.currInst.lastupdate;
                }
                //console.log(totalQ);
            }
            //вычесть значение из общей суммы
            if(!calcLine.add){
                totalQ = totalQ - calcLine.point.currInst.q;
                totalcdQ = totalcdQ - calcLine.point.currInst.currday;  
            }
        }
    }
    
    let avgP = totalP / activeCount;
    let avgT = totalT / activeCount;
    let avgdp = totaldp / activeCount;

    //установлен признак "брать Р или Т по отдельной линии"
    if(leadP){avgP = leadP}
    if(leadT){avgT = leadT}

    this.currInst = new DataTypes.InstantData(avgP, avgdp, avgT, totalQ, totalcdQ, maxTime, 192);

    //console.log(virtPoint);
}

function processIntegral(prop){
    //instant
    let totalQ = 0;
    let totalP = 0;
    let totalT = 0;
    let totaldp = 0;
    let maxTime = new Date(0);
    let smaxTime = new Date(0);
    let activeCount = 0;
    let leadP = null;
    let leadT = null;


    for (let calcLine of this.calcLines) {
   
        if (calcLine.enabled){

            //console.log(mp);
            if(calcLine.leadP) leadP = calcLine.point[prop].p;
            if(calcLine.leadT) leadT = calcLine.point[prop].t;
    
            //console.log(mp);

            if(calcLine.point[prop].q > 0 && calcLine.add){
                activeCount++;
                totalQ += calcLine.point[prop].q;
                totalP += calcLine.point[prop].p;
                totalT += calcLine.point[prop].t;
                totaldp += calcLine.point[prop].dp;
                
                //console.log(mp);
                
                if(calcLine.point[prop].end > maxTime){
                    
                    maxTime =  calcLine.point[prop].end;
                    smaxTime = calcLine.point[prop].start;
                }
                //console.log(totalQ);
            }
            //вычесть значение из общей суммы
            if(!calcLine.add){
                totalQ = totalQ - calcLine.point[prop].q;  
            }
        }
    }
    
    let avgP = totalP / activeCount;
    let avgT = totalT / activeCount;
    let avgdp = totaldp / activeCount;

    //установлен признак "брать Р или Т по отдельной линии"
    if(leadP){avgP = leadP}
    if(leadT){avgT = leadT}

    this[prop] = new DataTypes.IntegralData(avgP, avgdp, avgT, totalQ, smaxTime, maxTime, 192);
}

function processStat(){
    //instant
    let totalCO2 = 0;
    let totalN2 = 0;
    let totalRo = 0;
    let maxTime = new Date();
    let activeCount = 0;
    let leadStat = null;

    for (let calcLine of this.calcLines) {
   
        if (calcLine.enabled){
            //console.log(mp);
            if(calcLine.leadStat) leadStat = calcLine.point.currStat;
    
                activeCount++;
                totalCO2 += calcLine.point.currStat.co2;
                totalN2 += calcLine.point.currStat.n2;
                totalRo += calcLine.point.currStat.ro;

                if(calcLine.point.currStat.lastupdate > maxTime){
                    maxTime =  calcLine.point.currStat.lastupdate;
                }
        }
    }
    
    let avgCO2 = totalCO2 / activeCount;
    let avgN2 = totalN2 / activeCount;
    let avgRo = totalRo / activeCount;

    //установлен признак "брать stat params по отдельной линии or average"
    if(leadStat){
        this.currStat = leadStat;
    }
    else{
        this.currStat = new DataTypes.StatData(avgCO2, avgN2, avgRo, maxTime, 192);
    } 
    //console.log(virtPoint);
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