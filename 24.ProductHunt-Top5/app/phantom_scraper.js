var page = require('webpage').create();
var url = 'http://www.producthunt.com/';

page.open(url, function (status) {
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    var dataset = page.evaluate(function() {
      var data = [];
      $('.day.today .post').each(function(i, d){
        var tmp = {};
        tmp.title = $(this).children('.url').children('a').text();
        tmp.url = 'http://www.producthunt.com' + $(this).children('.url').children('a').attr('href');
        tmp.description = $(this).children('.url').children('span').text();
        tmp.upvote = $(this).children('.upvote').children('span').text();
        data.push(tmp)
      });
      return data;
    });

    console.log(JSON.stringify(dataset));
    phantom.exit();
  });
});