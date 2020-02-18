class IntegralFlowData {
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

  class InstantFlowData {
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
  
  class StatFlowData {
    constructor() {
      this.co2 = co2;
      this.n2 = n2;
      this.ro = ro;
      this.lastupdate;
      this.quality = 192;
    }
  }
   
  class CorrectorCfg {
    constructor(id) {
      this.corrid = id;
      this.name;
      this.ip;      //for ftp or ASK-2
      this.ftpDir = "./";
      this.channels = []; //CorrectorChannelCfg
    }
  } 

  //конфигурация канала корректора 
  class CorrectorChannelCfg {
    constructor(id) {
      this.correctorChannelId=id; //unique id - для привязки к линии 
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
class FlowLine {
    constructor(id) {
      this.flid = id;// unique line ид 
      this.eic;
      this.sapId;
      this.cfgLines = [];         //FlowLineCfg array
      this.correctorChannelId;    //CorrectorChannelCfg
    }

    get lastHour()  {};  //IntegralFlowData
    get lastDay()   {};  //IntegralFlowData
    get currInst()  {};  //InstantFlowData
    get currStat()  {};  //StatFlowData

    gethistHour(query)  {};  
    gethistDay(query)   {};
    gethistInst(query)  {};
    gethistStat(query)  {};
}

class FlowLineCfg {
    constructor(sensorId) {
      this.flowLineId;          //operand
      this.koef = 1;            //коэф пропорц слагаемого +/- с которой участвует линия в расчете
      this.leadP = false;       //ведущая линия для результата расчета Р, иначе расчет среднего
      this.leadT = false;       //ведущая линия для результата расчета Т, иначе расчет среднего
      this.leadStat = false;    //ведущая линия для результата расчета стат параметров, иначе расчет среднего
    }
}


//--------------------------------------------------
  class RealTimeData {
    constructor() {
      this.state;
      this.stateDescr;
      this.lastupdate;
      this.quality;
    }
  }
  
  class RealTimeSensor {
    constructor(id) {
      this.sensorid = id;
      this.name;  
    }
    get currValue()       {};//RealTimeData
    gethistValue(query)  {};//RealTimeData
    gethourAvg(query)    {};//RealTimeData
    getdayAvg(query)     {};//RealTimeData
  }

  class RealTimeSensorUpdateCfg {
    constructor(id) {
      this.id = id; //RealTimeSensor id
      this.name;
      this.path;        //SCADA path
      this.period;      //RealTimeData   update period  
      this.operation;   //proccess function name
    }
  }

