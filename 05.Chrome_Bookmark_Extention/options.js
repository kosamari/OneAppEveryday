document.addEventListener("DOMContentLoaded", function(event) {
  if(localStorage.keys){
    renderTags();
  }
});
document.getElementById('tag').onblur = function(){
  var string = document.getElementById("tag").value.split(' ').join('')

  if(string===''){
    localStorage.keys = '[]';
  }else{
    function checkComma(){
      var reg = /,$/;
      if(reg.test(string)){string=string.slice(0, -1); checkComma()}
    }
    checkComma()
    console.log(string)
    var array = string.split(',')
    localStorage.keys = JSON.stringify(array);
  }
  // chrome.extension.getBackgroundPage().tagsUpdate()
  renderTags();
};

function renderTags(){
  var tags = JSON.parse(localStorage.keys);
  var text = '';
  tags.forEach(function(tag){
    text += '<span class="tags">'+tag+'</span>'
  })
  document.getElementById('display').innerHTML = text;
  document.getElementById('tag').value = tags;
}