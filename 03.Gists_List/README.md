03. Gist List
==============
* Input : Local JSON file  
* Task : call Gist API to get data  
* Output : display in browser window  

This app use [underscore.js](http://underscorejs.org/) template function. Saucecode was conpiled using Browserify.  
Simply open index.html and select gist.txt (sample file). You'll see you can share private gist with others.  


To make your own list, create another JSON with following format  
    {
    "title": "Title of the list",
    "gists": [
        {
          "path":"gist id here" (ex: https://gist.github.com/kosamari/0aab88eec02d64339ed6 -> id is '0aab88eec02d64339ed6')
        },
        ...
      ]
    }
