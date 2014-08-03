$(document).ready(function(){
  $('.timer_num').click(edit_in_place());
  $('#start').click(function(){ count.state ? action.pause() : action.start();});
  $('#reset').click(function(){action.reset()});
})

function edit_in_place(){
  return function(){
    $(this).html(
      $('<input>')
        .attr('type','text')
        .attr('class','input_num')
        .attr('size','2')
        .attr('maxlength','2')
        .val($(this).text())
    );
    $('input', this).focus().blur(function(){
        var val = $(this).val();
        $(this).after(checkDigits(parseInt(val))).remove().unbind();
    });
  }
}

function checkDigits(n) {
    if(isNaN(n)){ return '00'; }
    else if (n>100){ return '99'; }
    else if (n<1){ return '00'; }
    else if(n<10){ return '0'+n; }
    else { return n; }
}

var count ={
  state: false,
  remain: 0,
  down: function(s){
    this.state = true;
    startTime = new Date().getTime();
    if(this.remain!==0){
      s = this.remain;
    }
    run = setInterval(function(){
      var nowTime = new Date().getTime(); 
      var timeDiff = (nowTime-startTime)/1000;
      var sec = s-timeDiff;
      sec = Math.round(sec*10)/10;
      this.remain = sec
      display.printNum(sec);
      if(sec<=0){
        clearInterval(run);
        count.state = false;
        action.done();
      }
    },100);
  },

  pause: function(){
    clearInterval(run);
    this.state = false;
  },

  reset: function(){
    if(this.state){
      clearInterval(run);
    }
    this.remain = 0;
    display.printNum(0);
    this.state = false;
  }
 };

var display = {
  start: function(){
    $('#start')
      .css('background-color','#FBC723')
      .text('Start');
  },
  pause: function(){
    $('#start')
      .css('background-color','#222222')
      .text('Pause');
  },
  printNum: function(sec) {
    $('#timer_min').text(checkDigits(Math.floor(sec/60)));
    $('#timer_sec').text(checkDigits(Math.floor(sec%60)));
  },
  error: function(p,t){
    p === 'hide' ? $('#error').text('').slideUp(100) : $('#error').text(t).slideDown(100) ;
  },
  log: function(p){
    p === 'hide' ?  $('#log').slideUp(100) : $('#log').slideDown(100);
  }
};

var log = {
  print:function(sec) {
    $('#log_start').text(this.timestamp);
    $('#log_min').text($('#timer_min').text());
    $('#log_sec').text($('#timer_sec').text());
  },
  timestamp: function(){
    var ts = new Date;
    return [ts.getFullYear(),ts.getMonth() + 1,ts.getDate()]
        .join( '/' ) + ' '
        + ts.toLocaleTimeString();
  },
  clear: function(){
    $('#log_min').text(checkDigits(''));
    $('#log_sec').text(checkDigits(''));
    $('#log_time').text('');
  }
};

var action = {
  getSec: function(){
    return parseInt($('#timer_min').text())*60 + parseInt($('#timer_sec').text());
  },
  start: function(){
    display.log('hide');
    var time = this.getSec();
    if(time===0){
      display.error('show','Please set cooking time first.');
    }else{
        log.print();
        display.error('hide');
        display.pause();
        count.down(this.getSec());
        log.print(this.getSec());
    }   
  },
  pause: function(){
    count.pause();
    display.start();
  },
  reset: function(){
    count.reset();
    log.clear();
    display.error('hide');
    display.log('hide');
    display.start();
  },
  done: function(){
    $('#log_end').text(log.timestamp);
    display.log('show');
    display.start();
  }
};