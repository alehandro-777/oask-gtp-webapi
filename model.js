exports.IntegralFlowData = class IntegralFlowData {
    constructor() {
      this.p;
      this.t;
      this.dp;
      this.q;
      this.start;
      this.end;
      this.quality;
    }
  }

  exports.InstantFlowData = class InstantFlowData {
    constructor() {
      this.p;
      this.t;
      this.dp;
      this.q;
      this.currday;
      this.lastupdate;
      this.quality;
    }
  }
  
  exports.StatFlowData =  class StatFlowData {
    constructor() {
      this.co2 = co2;
      this.n2 = n2;
      this.ro = ro;
      this.lastupdate;
      this.quality = 192;
    }
  }
   
  exports.CorrectorCfg =  class CorrectorCfg {
    constructor() {
      this.corrid;
      this.name;
      this.ip;      //for ftp or ASK-2
      this.ftpDir = "./";
      this.channels = []; //CorrectorChannelCfg
    }
  } 

  //конфигурация канала корректора 
  exports.CorrectorChannelCfg =  class CorrectorChannelCfg {
    constructor() {
      this.correctorChannelId; //unique id - для привязки к линии 
      this.channNo;   //1 2 3 
      this.lineName;  //friendly name  
      this.fNameTemplate = "S000R";
      this.isAbsP = true;
      this.contractHour = 7;
      this.hasPeriodic = true;
      this.hasHour = true;
    }
  } 

//линия изменения или рачета расхода - содержит формулу расчета или физ канал
exports.FlowLine = class FlowLine {
    constructor(id) {
      this.flid = id;// unique line ид 
      this.eic;
      this.cfgLines = [];         //FlowLineCfg array
      this.correctorChannelId;    //CorrectorChannelCfg
    }
}

exports.FlowLineCfg = class FlowLineCfg {
    constructor(sensorId) {
      this.flowLineId;          //operand
      this.koef = 1;            //коэф пропорц слагаемого +/- с которой участвует линия в расчете
      this.leadPt = false;       //ведущая линия для результата расчета Р, иначе расчет среднего
      this.leadStat = false;    //ведущая линия для результата расчета стат параметров, иначе расчет среднего
    }
}


//--------------------------------------------------
exports.RealTimeData = class RealTimeData {
    constructor() {
      this.state;
      this.stateDescr;
      this.lastupdate;
      this.quality;
    }
  }
  
exports.RealTimeSensor =  class RealTimeSensor {
  constructor(id) {
    this.sensorid = id;
    this.name;  
  }
}

exports.RealTimeSensorUpdateCfg = class RealTimeSensorUpdateCfg {
  constructor(id) {
    this.id = id; //RealTimeSensor id
    this.name;
    this.path;        //SCADA path
    this.period;      //RealTimeData   update period  
    this.operation;   //proccess function name
  }
}

exports.Paginator = class Paginator {
  constructor(page, size, array) {
    this.page = page;
    this.size = size;
    this.length = array.length;
    this.prev = (page > 1) ? page-1 : null;
    this.next = (array[size*page]) ? page+1 : null;
  }
}
