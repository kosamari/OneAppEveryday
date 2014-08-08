var bgr = chrome.extension.getBackgroundPage();
window.addEventListener('DOMContentLoaded', bookmark());
var tagarea = document.getElementById('tags');

function bookmark(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    bgr.isBookmarked(tabs[0].url, function(id){
      if(id){
        showtags(id);
          tagarea.insertAdjacentHTML('beforeend','<br><input type="button" name="save" value="remove bookmark" id="save"/>')
          document.getElementById('save').addEventListener('click' , function(){ 
            removeBookmark(id);
          })
      }else{
        addBookmark(tabs[0].title,tabs[0].url,id);
      }
    });
  });
}

function showtags(id){
  var tags = JSON.parse(localStorage.tags)
  var keys = JSON.parse(localStorage.keys)
  tags.forEach(function(tagObj,i) {
    if(tagObj.id===id){
      if(tagObj.tag.length > 0){
        var tags = tagObj.tag
        var map = [];
        keys.forEach(function(key){
          tags.forEach(function(tag){
            if(key === tag ){ map.push(tag)}
          })
        });

        keys.forEach(function(key){
          var index = map.indexOf(key);
          if(index >= 0){
            var state = function(){updateTagStatus(id,key,document.getElementById(key).checked)};
            createTags(key, id, 'on');
          }else{
            createTags(key, id, 'off');
          }
        });

      }else{
        if(keys.length > 0){
          keys.forEach(function(key) {
            createTags(key, id, 'off');
          });
        }else{
          tagarea.innerHTML = 'please set keys';
        }
      }
    }
  });
}

function createTags(key, id, state){
  
  var set = {
    on: function(){
      tagarea.insertAdjacentHTML('beforeend','<label><input id="'+key+'" type="checkbox" checked/>'+key+'</label>')
      document.getElementById(key).addEventListener('click' ,function(){updateTagStatus(id,key,document.getElementById(key).checked)})
    },
    off : function(){
      tagarea.insertAdjacentHTML('beforeend','<label><input id="'+key+'" type="checkbox"/>'+key+'</label>')
      document.getElementById(key).addEventListener('click' ,function(){updateTagStatus(id,key,document.getElementById(key).checked)})
    }
  };
  state==='on' ? set[state](key,id) : set[state](key,id) ;
}


function updateTagStatus(id,tagname,state){
  if(localStorage.tags){
    var tags = JSON.parse(localStorage.tags);
    tags.forEach(function(tagObj){
      if(tagObj.id===id){
        var index = tagObj.tag.indexOf(tagname)
        if(index >=0){
          if(!state){tagObj.tag.splice(index, 1)}
        }else{
          if(state){tagObj.tag.push(tagname)}
        }
      }
    })
    localStorage.tags = JSON.stringify(tags)
  }
}


function removeBookmark(id){
  chrome.bookmarks.remove(id, function(){
    bgr.iconSwitch('off');
    var tags = JSON.parse(localStorage.tags);
    tags.forEach(function(tag,i){
      var key = tag.id;
      if(key===id){
        tags.splice(i, 1)
      }
    })
    localStorage.tags = JSON.stringify(tags)
    window.close();
  })
}

function addBookmark(tabTitle,tabUrl){
  chrome.bookmarks.create({title:tabTitle,parentId:localStorage.folderId,url:tabUrl},function(newbookmark){
    bgr.iconSwitch('on');
    if(localStorage.tags){
      var tags = JSON.parse(localStorage.tags);
      var obj = { id:newbookmark.id, tag:[]};
      tags.push(obj);
      localStorage.tags = JSON.stringify(tags);
    }else{
      localStorage.tags = '[{ "id" :"'+newbookmark.id+'", "tag":[]}]'
    }
    showtags(newbookmark.id)
  });
}