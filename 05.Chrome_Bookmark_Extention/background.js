// chrome.browserAction.setBadgeText({"text":'NEW'});
// window.addEventListener('DOMContentLoaded', checkFolder());
var extFolder = 'Extensiorrrrrn!';
var extParentFolder = 'Bookmarks Bar';
var iconOn = 'img/19_b.png';
var iconOff = 'img/19_nb.png';


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  isBookmarked(tab.url,function(e){
    if(e){iconSwitch('on')}else{iconSwitch('off')}
  })
});

localStorage.folderId ? serchInFolder(localStorage.folderId, function(){}) : createFolder(function(){});


function iconSwitch(s){
  if(s==='on'){chrome.browserAction.setIcon({path: iconOn})}
  else{chrome.browserAction.setIcon({path: iconOff})}
}

function isBookmarked(url,callback){
  serchInFolder(localStorage.folderId, function(result){
    var bookmarks = []; 
    var bookmarksId = []; 
    result[0].children.forEach(function(bookmark){
      bookmarks.push(bookmark.url);
      bookmarksId.push(bookmark.id)
    })
    var index = bookmarks.indexOf(url);
    var id = bookmarksId[index];
    if(index>=0){
      return callback(id);
    }else{
      return callback(false);
    }
  })
}

function serchInFolder(id, callback){
  chrome.bookmarks.getSubTree(id, function (result){
    if(typeof(result) === 'undefined'){
      createFolder(function(){serchInFolder(localStorage.folderId,callback)});
    }else{
      callback(result);
      return;
    }
  });
}

tagsUpdate();

function tagsUpdate(){
  var keys = JSON.parse(localStorage.keys)
  var tags = JSON.parse(localStorage.tags)

  tags.forEach(function(tag){
    console.log(tag)
  })
  // if(!localStogage.keys){callback(result); return;}
  //get localStogage.keys as list, for each get localStorage.tags and get id as list
  // array of array 集合値だけ残して他を削除する
  //if all false add localStorage.flag = true;
}

function createFolder(callback){
  chrome.bookmarks.getTree(function(root){
    root[0].children.forEach(function(node) {
      if(node.title === extParentFolder){
        chrome.bookmarks.create({
          'parentId': node.id,
          'title': extFolder
        },
        function(newFolder) {
          localStorage.folderId = newFolder.id;
          callback()
          return; 
        });
      }
    });
  });
}