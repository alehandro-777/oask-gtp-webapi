exports.IntegralFlowData = class IntegralFlowData {
    constructor() {
      this.p;
      this.t;
      this.dp;
      this.q;
      this.start;
      this.end;
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

//линия изменения или рачета расхода - содержит формулу расчета или физ канал, по лини ведутся архивы - мгн, интеграл, стат
exports.FlowLine = class FlowLine {
    constructor() {
      this.flid;          // unique line ид 
      this.name;          //friendly flowline name 
      this.eic;
      this.cfgLines = []; //FlowLineCfg array
      this.chid;          //CorrectorChannelCfg - привязка к физ линии
    }
}

exports.FlowLineCfg = class FlowLineCfg {
    constructor() {
      this.flid;                //operand - ид физ линии линии
      this.koef = 1;            //коэф пропорц слагаемого +/- с которой участвует линия в расчете
      this.leadPt = false;      //ведущая линия для результата расчета Р, иначе расчет среднего
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

//структура для отрисовки листания страниц на графическом интерфейсе
exports.Paginator = class Paginator {
  constructor(page, size, array) {
    this.page = page;
    this.size = size;
    this.length = array.length;
    this.prev = (page > 1) ? page-1 : null;
    this.next = (array[size*page]) ? page+1 : null;
  }
}
