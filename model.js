exports.IntegralFlowData = class IntegralFlowData {
    constructor() {
      this.p;
      this.t;
      this.dp;
      this.q;
      this.start;
      this.lastupdate;
      this.quality;
      this.flid;  //id изм линии 
      this.chid;  //id канала корректора
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
      this.flid;  //id изм линии 
      this.chid;  //id канала корректора
    }
  }
  
  exports.StatFlowData =  class StatFlowData {
    constructor() {
      this.co2 = co2;
      this.n2 = n2;
      this.ro = ro;
      this.lastupdate;
      this.quality = 192;
      this.flid;  //id изм линии 
      this.chid;  //id канала корректора
    }
  }
   
  exports.CorrectorCfg =  class CorrectorCfg {
    constructor() {
      this.corrid;
      this.addr;
      this.name;
      this.ip;            //for ftp or ASK-2
      this.ftpDir = "./";
      this.channels = []; //CorrectorChannelCfg
    }
  } 

  //конфигурация канала корректора 
  exports.CorrectorChannelCfg =  class CorrectorChannelCfg {
    constructor() {
      this.chid;            //unique id - для привязки к линии как к источнику данных 
      this.chno;            //1 2 3 internal corrector channel number
      this.name;            //friendly line name  
      this.template;        //шаблон имени файла хослиб
      this.isAbsP = true;   //P sersor type
      this.chour = 7;       //contract hour
      this.hasR = true;     //has hour file
      this.hasH = true;     //has periodic file
    }
  } 

//линия изменения физическая, имеет привязку канала корректора по лини ведутся архивы - мгн, интеграл, стат
exports.FlowLine = class FlowLine {
    constructor() {
      this.flid;          // unique line ид 
      this.name;          //friendly flowline name 
      this.chid;          //CorrectorChannelCfg - привязка к физ линии корректора
    }
}

//объект базы данных
exports.DBObject = class DBObject {
  constructor() {
    this.object_id;     // unique line ид 
    this.name;          //key name 
    this.params;        //array of parameters
  }
}

//state объект базы данных
exports.DBObjectValue = class DBObjectValue {
  constructor() {
    this.object_id;     // unique line ид 
    this.name;          //key name - for debug
    this.value;         //value as num
    this.state;         //value as string
    this.source;        //value source
    this.lastupdate; 
  }
}



//--------------------------------------------------
exports.RealTimeData = class RealTimeData {
    constructor() {
      this.paramid;     //number - sersorId or null - manual parameter
      this.sensorid;    //number - sersorId or null - manual parameter
      this.value; 
      this.state;       //text
      this.stateDesc;   //test state descriptor (auto? out of limits)
      this.lastupdate;
      this.quality;     //
    }
}

exports.RegimParameter = class RegimParameter {
  constructor() {
    this.paramid;     //unique regim parameter auto or manual
    this.sensorid;    //RealTimeSensor id
    this.name;
  }
}

exports.RTSystemCfg = class RTSensorCfg {
  constructor() {
    this.systemid; //RealTimeSensor id
    this.name;
    this.path;        //SCADA path
    this.ip;          //SCADA path
    this.period;      //RealTimeData   update period
    this.sensors;      //[] points array RTSensorCfg
  }
}

exports.RTSensorCfg = class RTSensorCfg {
  constructor() {
    this.sensorid;    //RealTimeSensor id
    this.name;        //Friendly sensor name
    this.path;        //SCADA path
    this.low;    //validation 
    this.high;   //validation
  }
}

//структура для отрисовки листания страниц на графическом интерфейсе
exports.Paginator = class Paginator {
  constructor(page, size, count) {
    this.page = page;
    this.size = size;
    this.length = count;
    this.prev = (page > 1) ? page-1 : null;
    this.next = (size*(page + 1) < count) ? page + 1 : null;
  }
}


