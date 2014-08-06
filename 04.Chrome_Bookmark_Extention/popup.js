var bgr = chrome.extension.getBackgroundPage();
window.addEventListener('DOMContentLoaded', getFolder());

var extFolder = 'Extension!';
var extParentFolder = 'Bookmarks Bar';
var folder;

function getFolder(){
chrome.bookmarks.getTree(function(tree){
    checkParent(tree[0]);
});
}

function checkParent(node) {
    if(node.children) {
        node.children.forEach(function(parent) {
            if(parent.title.indexOf(extParentFolder)>=0){
                if(parent.children) {
                    checkFolder(parent)
                }else{
                    createFolder(node.id)
                }
            }
        });
    }
    return;
}

function checkFolder(parent){
    var titles = [];
    var ids = [];

    parent.children.forEach(function(c){
        if(c.children){
            titles.push(c.title);
            ids.push(c)
        }
    });

    if(titles.indexOf(extFolder)>=0){
        folder = ids[titles.indexOf(extFolder)];
        getUrl();
        return;
    }else{
        createFolder(parent.id);
        getUrl();
    }
}   

function createFolder(parentId){
    chrome.bookmarks.create({'parentId': parentId,
                               'title': extFolder},
                              function(newFolder) {
                                folder = newFolder;
                                bgr.console.log(folder)
    });
}

function getUrl(){
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        addBookmark(tabs[0].url, tabs[0].title);
    });
}

function addBookmark(bookmarkURL, bookmarktitle){
    if(folder.id){
        chrome.bookmarks.create({title:bookmarktitle,parentId:folder.id,url:bookmarkURL});
        document.getElementById('message').innerHTML='Added to "'+folder.title+'" folder';
    }else{
        document.getElementById('message').innerHTML='bookmark failed!';
    }
}