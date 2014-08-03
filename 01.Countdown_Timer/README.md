01. Countdown Timer
==============
[JSFiddle Here](http://jsfiddle.net/kosamari/b84Y9/)  
* Input : User input minuites and seconds they want this app to count down  
* Task : This app countdown time using setInterval()  
* Output : Number on display changes as time count down  

Countdown function was copy form old project.  
I've created edit in place function for this app.  

    function edit_in_place(){
      return function(){
        $(this).html($('<input>').val($(this).text()));
        $('input', this).focus().blur(function(){
            $(this).after($(this).val()).remove().unbind();
        });
      }
    }

    $('element').click(edit_in_place());