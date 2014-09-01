var request = require('request');
var parseString = require('xml2js').parseString;

exports.run = function(callback){
  request('https://vimeo.com/channels/fubiz/videos/rss',function(err,resp,body){
    if(err){ console.log(err); return}
    if(resp.statusCode === 200){
    var array = [];

    parseString(body, function (err, result) {
      result.rss.channel[0].item.forEach(function(obj,i){
        var url = obj['media:content'][0]['media:player'][0].$.url;
        url = url.replace('http://vimeo.com/moogaloop.swf?clip_id=', '');
        array.push(url)
      })
      callback(array)
    });
    }
  })
}