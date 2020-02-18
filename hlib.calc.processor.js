//MongoDb hlib data  collections names
const HOUR_COLL_NAME = 'HourHlData';
const INST_COLL_NAME = 'InstHlData';
const DAY_COLL_NAME = 'DayHlData';
const STAT_COLL_NAME = 'StatHlData';

const repository = require('./repository');

exports.getlastHour = (flowLine)  => {

};  //IntegralFlowData

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