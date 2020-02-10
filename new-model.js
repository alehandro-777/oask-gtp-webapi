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
  
  class FlowSensor {
      constructor(id) {
        this.id = id;
        this.name;
        this.lastHour = {};  
        this.lastDay = {};
        this.currInst = {};
        this.currStat = {};
  
        this.histHour = [];  
        this.histDay = [];
        this.histInst = [];
        this.histStat = []; 
      }
  }
  
  class CorrectorCfg {
    constructor(id) {
      this.id = id;
      this.extid;   //SAP id ??
      this.name;
      this.ip;      //ftp or ASK
      this.ftpDir = "./";
      this.channels = [];//CorrectorChannelCfg
    }
  } 

  class CorrectorChannelCfg {
    constructor(id) {
      this.id=id;    
      this.lineName;  
      this.fNameTemplate = "S000R";
      this.isAbsP = true;
      this.contractHour = 7;
      this.hasPeriodic = true;
      this.hasHour = true;
    }
  } 

class VirtualFlowSensorCfg {
    constructor(id) {
      this.id = id;// ид сенсора (физический или виртуальный)
      this.eic;
      this.sapId;
      this.cfgLines = [];//VirtualFlowSensorCfgLine
    }
}

class VirtualFlowSensorCfgLine {
    constructor(sensorId) {
      this.sensorId = sensorId;// ид сенсора (физический или виртуальный)
      this.enabled = true;  //нужно ?
      this.koef = 1;        //коэф пропорц + - с которой участвует линия в расчете
      this.leadP = false;   //ведущая линия для результата расчета Р, иначе расчет среднего
      this.leadT = false;   //ведущая линия для результата расчета Т, иначе расчет среднего
      this.leadStat = false;//ведущая линия для результата расчета стат параметров, иначе расчет среднего
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
      this.id = id;
      this.name;
      this.currValue = {};  //RealTimeData
      this.histValues = []; //RealTimeData     
    }
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

  // нужен ли еще 1 уровень виртуализации ???? может для тестов ???
  class VirtualSensor {
    constructor(id) {
      this.id = id;
      this.name;
      this.currValue = {};  //SimpleData
      this.histValues = []; //SimpleData
    }
  } 

  class VirtualSensorUpdateCfg {
    constructor(id) {
      this.id = id; //Sensor id
      this.name;
      this.rtid;    //RealTimeSensor id
      this.period;  //  update period  sec
      this.operation;   //proccess function name state decode
    }
  }