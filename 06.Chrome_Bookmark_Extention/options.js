document.addEventListener("DOMContentLoaded", function(event) {
  if(localStorage.keys){
    var keywords = JSON.parse(localStorage.keys);
      keywords.forEach(function(keyword){
        renderTag(keyword)
      });
  }
});

document.getElementById('input').onkeydown = function (e) {
    e.keyCode = e.which || e.keyCode;
    if(e.which == 13) {
      addTag();
    }
}

document.getElementById('input').onblur = addTag;

function addTag() { 
  clearMessage();

  var string = document.getElementById("input").value.split(' ').join('');
  document.getElementById("input").value = '';
  if(string===''){
    return;
  }else{
    function checkComma(){
      var reg = /,$/;
      if(reg.test(string)){string=string.slice(0, -1); checkComma()}
    }
    checkComma();

    var newkeywords = string.split(',');
    var savedkeywords = JSON.parse(localStorage.keys);
    
    newkeywords.forEach(function(keyword){
      var exist = savedkeywords.indexOf(keyword);
      if(exist>=0){
        var msg = document.createElement('p')
        msg.innerHTML = 'tag "'+ keyword+'" is already registered.'
        document.getElementById('message').appendChild(msg)
      }else{
        renderTag(keyword);
        savedkeywords.push(keyword)
      }
    })
    localStorage.keys = JSON.stringify(savedkeywords);
  }
};
function clearMessage(){
  var element = document.getElementById("message");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
function deleteTag(keyword){
  clearMessage();
  var savedkeywords = JSON.parse(localStorage.keys);
  var index = savedkeywords.indexOf(keyword);
  savedkeywords.splice(index,1);
  localStorage.keys = JSON.stringify(savedkeywords)
}

var lastnode;

function renderTag(keyword){
  var div = document.createElement("div");
    div.innerHTML=keyword;
    div.id=keyword;
  var span = document.createElement("span");
    span.className='del';
    span.innerHTML='x';
    span.addEventListener('click',function(){
      deleteTag(this.parentNode.id)
      lastnode = this.parentNode;
      this.parentNode.remove(this.parentNode);
      undo();
    });
  div.appendChild(span)
  document.getElementById('tags').appendChild(div);
}

function undo(){
  var span = document.createElement("span");
  span.innerHTML='undo';
  span.addEventListener('click',function(){
      document.getElementById('tags').appendChild(lastnode);
      clearMessage();
      var savedkeywords = JSON.parse(localStorage.keys);
        savedkeywords.push(lastnode.id)
        localStorage.keys = JSON.stringify(savedkeywords)
    });
  document.getElementById('message').appendChild(span)
}

var keys = JSON.parse(localStorage.keys);

var keyList = [];
var tags = JSON.parse(localStorage.tags);
var bookmarks;

keys.forEach(function(key,i){
  keyList[i] = [];
})

tags.forEach(function(tagObj){
  tagObj.tag.forEach(function(tagname){
    var index = keys.indexOf(tagname);
    if(index>=0){
      keyList[index].push(tagObj.id)
    }
  })
})


chrome.extension.getBackgroundPage().serchInFolder(localStorage.folderId,function(result){
  bookmarks = result[0].children;
  keys.forEach(function(key,i){
    var div = document.createElement("div");
    div.innerHTML = key
    div.id = key+'-list';
    document.getElementById('list').appendChild(div);
    if(keyList[i].length>0){
      keyList[i].forEach(function(id){
        bookmarks.forEach(function(bookmark){
          if(bookmark.id === id){
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href=bookmark.url;
            a.innerHTML=bookmark.title;
            li.appendChild(a)
            document.getElementById(key+'-list').appendChild(li);
          }
        })
      })
    }
  })
})




