var _ = require('underscore');

$(document).ready(function(){

  $( '#pl-file' ).change(function() {
    var input = document.querySelector('#pl-file').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var json = JSON.parse(reader.result);
      var i = 0;
      function callAPI(){
        if(i>json.gists.length-1){actionBind(); return;}
        addGist(function(){i++;callAPI();}, json.gists[i].path);
      }
      callAPI();
    };
    reader.readAsText(input,'utf-8');
  });

  function addGist(callback,path){
    $.ajax({
      url: 'https://api.github.com/gists/'+path,
      type: 'get',
      dataType: 'json',
      error: function(err){
        console.log( 'Page Not Found' );
        console.log( err );
      },
      success: function( strData ){
        console.log('success');
        processData(strData);
      }
    });

    function processData(data){
      function checkstatus(){
        if(data.public){return 'public';}else{return 'private';}
      }
      var headder = {
        id:data.id,
        description: data.description,
        status:checkstatus()
      };
      var gistBlock = _.template($('#gistBlock-template').text());
      $('#container').append(gistBlock(headder));

      _.each(data.files, function(file){
        var codeblock = {
          filename:file.filename,
          language:file.language,
          content :file.content
        };
        var gistCodeblock = _.template($('#gistCodeblock-template').text());
        $('#'+headder.id).children('.gistCodeblock').append(gistCodeblock(codeblock));
      });

      callback();
    }
  }

  function actionBind(){
    //syntax highlight
    $(document).ready(function() {
      $('pre').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });

    //click event bind
    $( '.gistTitle' ).click(function() {
      var parent = $(this).parents().attr('id');
      var child = $('#'+parent).children('.gistCodeblock');

      if($(child).is(':visible')){
        $(child).slideUp('fast', function(){
          $('#'+parent).children('.gistTitle')
          .css('border-bottom-left-radius','5px')
          .css('border-bottom-right-radius','5px');
        });}
      else{
        $('#'+parent).children('.gistTitle')
          .css('border-bottom-left-radius','0px')
          .css('border-bottom-right-radius','0px');
        $(child).slideDown('fast');
      }

    });
  }

});

