var bgr = chrome.extension.getBackgroundPage();
window.addEventListener('DOMContentLoaded', bookmark());
var tagarea = document.getElementById('tags');

function bookmark(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    bgr.isBookmarked(tabs[0].url, function(id){
      if(id){
        showtags(id);
          
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
  tagarea.insertAdjacentHTML('beforeend','<div><input type="button" name="save" value="remove" id="del"/></div>')
          document.getElementById('del').addEventListener('click' , function(){ 
            removeBookmark(id);
          })
}

function createTags(key, id, state){
  
  var set = {
    on: function(){
      tagarea.insertAdjacentHTML('beforeend',this.taghtml);
      document.getElementById(key).checked = true;
      document.getElementById(key).addEventListener('click' ,function(){bgr.updateTagStatus(id,key,document.getElementById(key).checked)})
    },
    off : function(){
      tagarea.insertAdjacentHTML('beforeend',this.taghtml)
      document.getElementById(key).addEventListener('click' ,function(){bgr.updateTagStatus(id,key,document.getElementById(key).checked)})
    },
    taghtml : '<div class="tagbutton"><label><input id="'+key+'" type="checkbox" hidden/><span>'+key+'</span></label></div>'

  };
  state==='on' ? set[state](key,id) : set[state](key,id) ;
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