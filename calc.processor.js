
//сумматор
exports.SumChan = (values, parname) => {
    let total=0;      
    values.forEach(element => {
      total += element[parname];
    });   
    return total;
};
//average
exports.AvgChan = (values, parname) => {
    let total=0;      
    values.forEach(element => {
      total += element[parname];
    });
  return total / values.length;
};

//max
exports.MaxChan = (values, parname) => {
    let max;
    values.forEach(element => {
      if(element[parname] > max) max = element[parname];
    });
    return max;
};

