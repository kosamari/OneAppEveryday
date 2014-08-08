document.addEventListener("DOMContentLoaded", function(event) {
  if(localStorage.keys){
    document.getElementById('tag').value = JSON.parse(localStorage.keys);
    document.getElementById('display').innerHTML = localStorage.keys;
  }
});
document.getElementById('tag').onblur = function(){
  var string = document.getElementById("tag").value
  if(string===''){

    localStorage.keys = JSON.stringify('[]')
  }else{

  var array = string.split(',')
  localStorage.keys = JSON.stringify(array);
  }
  document.getElementById('display').innerHTML = string;
};
