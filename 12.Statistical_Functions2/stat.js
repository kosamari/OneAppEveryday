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
  if(data.lenght !== weight.lenght){return null}
    var sum = 0;
  _.each(data,function(d,i){
    sum += d*weight[i]
  })
  return sum
}

function sd(data){
  var m = mean(data)
  var sum = 0;
  _.each(data,function(d,i){
    sum += Math.pow(d - m,2);
  })
  return Math.sqrt(sum/(data.length-1))
}

function mad(data){
  var m = median(data)
  var array = [];
  _.each(data,function(d,i){
    array.push(Math.abs(d-m))
  })

  return median(array)* 1.4826
}

//add mode
