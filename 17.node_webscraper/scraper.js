var request = require('request');
var cheerio = require('cheerio');

request('http://video.pbs.org/program/masterpiece/episodes/',function(err,resp,body){
  if(err){ console.log(err); return}
  if(resp.statusCode === 200){
    var $ = cheerio.load(body)
    var json = [];
    $('#videoResults .programTitle a').each(function() {
      var tmp = {}
      tmp.title = $(this).text()
      tmp.url = $(this).attr('href')
      json.push(tmp)
    });
    console.log(json)
  }
})

