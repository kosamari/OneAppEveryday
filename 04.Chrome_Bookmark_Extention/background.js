// chrome.browserAction.setBadgeText({"text":'NEW'});
// window.addEventListener('DOMContentLoaded', checkFolder());
var extFolder = 'Snnipets';
var extParentFolder = 'Bookmarks Bar';

var defaultsites = ['http://codepen.io/', 'https://gist.github.com/', 'http://jsfiddle.net/'];
var sites, reg;
var iconOn = 'img/19_b.png';
var iconOff = 'img/19_nb.png';

localStorage.sites ? sites = localStorage.sites : sites = defaultsites;

var reg = new RegExp(sites.toString().split(',').join('|').split('/').join('\\/'));

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url && reg.test(tab.url)) {
    isBookmarked(tab.url,function(e){
      if(e){ iconSwitch('on',tabId)}
    })
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener(function(){
  bookmark();
})

localStorage.folderId ? serchInFolder(localStorage.folderId, function(){}) : createFolder(function(){});
function iconSwitch(s,tabId){
  console.log('called')
  if(s==='on'){chrome.pageAction.setIcon({tabId: tabId, path: iconOn})}
  else{chrome.pageAction.setIcon({tabId: tabId, path: iconOff})}
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
      createFolder(function(){serchInFolder(localStorage.folderId)});
    }else{
      callback(result);
      return;
    }
  });
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

function bookmark(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.extension.getBackgroundPage().isBookmarked(tabs[0].url, function(id){
      if(id){
        chrome.bookmarks.remove(id, function(){
          iconSwitch('off',tabs[0].id);
        })
      }else{
        iconSwitch('on',tabs[0].id);
        chrome.bookmarks.create({title:tabs[0].title,parentId:localStorage.folderId,url:tabs[0].url});
      }
    });
  });
}

