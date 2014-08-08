var bgr = chrome.extension.getBackgroundPage();
window.addEventListener('DOMContentLoaded', bookmark());

function bookmark(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    bgr.isBookmarked(tabs[0].url, function(id){
      bgr.console.log(id)
      if(id){
        showtags(id);
        $('#tags').append('<br><input type="button" name="save" value="remove bookmark" id="save"/>');
        $('#save').click(function(){ 
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
  
  tags.forEach(function(tag,i){
    var key = Object.keys(tag)[0]
    if(key===id){
      bgr.console.log(tag[key])
      if(tag[key].length > 0){
        var keys = JSON.parse(localStorage.keys)
        var tags = tag[key]
        var match = [];

        keys.forEach(function(key,i){
          
          tags.forEach(function(tag,j){
            if(key === tag ){match.push(key)}
            })
        });

        keys.forEach(function(key,i){
          var index = match.indexOf(key);
          if(index>=0){
            $('#tags').append('<label><input id="'+key+'" type="checkbox" checked/>'+key+'</label>')
            $('#'+key).click(function(){updateTagStatus(id,key,document.getElementById(key).checked)})
          }else{
            $('#tags').append('<label><input id="'+key+'" type="checkbox" checked/>'+key+'</label>')
            $('#'+key).click(function(){updateTagStatus(id,key,document.getElementById(key).checked)})
          }
        });
      }else{
        var keys = JSON.parse(localStorage.keys)

        if(keys.length > 0){

          var keys = JSON.parse(localStorage.keys);
          keys.forEach(function(key){
           $('#tags').append('<label><input id="'+key+'" type="checkbox" />'+key+'</label>')
           $('#'+key).click(function(){updateTagStatus(id,key,document.getElementById(key).checked)})
          });
        }else{

          $('#tags').html('please set keys')
        }
    };


    }

  });
}

function updateTagStatus(id,tagname,state){
  var tags = [];
  if(localStorage.tags){
    tags = JSON.parse(localStorage.tags);
  
  tags.forEach(function(tag){
    var key = Object.keys(tag)[0];
    if(key===id){
      bgr.console.log(tagname)
      var index = tag[key].indexOf(tagname)
      if(index >=0){
        if(!state){tag[key].splice(index, 1)}
        return;
      }else{
        if(state){tag[key].push(tagname)}
      }
    }
  })
  localStorage.tags = JSON.stringify(tags)
  }

}


function removeBookmark(id){
  bgr.console.log(id)
  bgr.console.log('del')
    chrome.bookmarks.remove(id, function(){
        bgr.iconSwitch('off');
        var tags = JSON.parse(localStorage.tags);
        
        tags.forEach(function(tag,i){
          var key = Object.keys(tag)[0];
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
    if(localStorage.tags){
      var tags = JSON.parse(localStorage.tags);
      var obj = JSON.parse('{"'+newbookmark.id+'":[]}');
      tags.push(obj);
      localStorage.tags = JSON.stringify(tags);
    }else{
      localStorage.tags = '[{"'+newbookmark.id+'":[]}]'
    }
    showtags(newbookmark.id)
    bgr.iconSwitch('on');
  });
}