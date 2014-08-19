function sum(data){
  return  _.reduce(data, function(memo, num){ return memo + num; }, 0);
}

function mean(data){
  return sum(data)/data.length
}

function median(data){
  return percentile(data,50);
}

function range(data){
  return [_.min(data),_.max(data)]
}

function IQR(data){
  return percentile(data,75) - percentile(data,25);;
}

function summary(data){
  var tmp = {};
  tmp['Min'] = percentile(data,0);
  tmp['1st_Qu'] = percentile(data,25);
  tmp['Median'] = percentile(data,50);
  tmp['Mean'] = mean(data)
  tmp['3rd_Qu'] = percentile(data,75);
  tmp['Max']= percentile(data,100);
  return tmp;
}

function quantile(data){
  var tmp = {};
  tmp['0%'] = percentile(data,10);
  tmp['25%'] = percentile(data,25);
  tmp['50%'] = percentile(data,50);
  tmp['75%'] = percentile(data,75);
  tmp['100%'] = percentile(data,100);
  return tmp;
}

function percentile(data,p){
  if (p===100){return _.max(data)}
  if (p===0){return _.min(data)}
  var v = _.sortBy(data,function(n){return n});
  var h = ((v.length-1)*(p/100));
  return v[Math.floor(h)]+((h-Math.floor(h))*(v[Math.floor(h)+1]- v[Math.floor(h)]))
}

function weighted_mean(data,weight){
  if(data.length !== weight.length){return null}
    var sum = 0;
  _.each(data,function(d,i){
    sum += d*weight[i]
  })
  return sum
}

function pow(data,p){
  var tmp = [];
  _.each(data, function(d,i){
    tmp.push(Math.pow(d,p))
  })
  return tmp
}

function sbtr(data,s){
  var tmp =[];
  _.each(data, function(d,i){
    tmp.push(d - s);
  })
  
  return tmp
}

function mrt(xdata,ydata){
  var tmp =[];
  _.each(xdata, function(d,i){
    tmp.push(xdata[i]*ydata[i]);
  })
  return tmp
}

function abs(data){
  var tmp = [];
  _.each(data, function(d,i){
    tmp.push(Math.abs(d));
  })
  return tmp
}

function sd(data){
  return Math.sqrt(vari(data))
}

function mad(data){
  return median(abs(sbtr(data,median(data)))) * 1.4826
}

function cor(xdata,ydata){
  if(xdata.length !== ydata.length){return null}
  return cov(xdata,ydata) / (Math.sqrt(sum(pow(sbtr(xdata,mean(xdata)),2)))*Math.sqrt(sum(pow(sbtr(ydata,mean(ydata)),2))))
}

function cov(xdata,ydata){
  if(xdata.length !== ydata.length){return null}
  return sum(mrt(sbtr(xdata,mean(xdata)),sbtr(ydata,mean(ydata))))
}

function vari(data){
  return sum(pow(sbtr(data,mean(data)),2))/(data.length-1)
}
