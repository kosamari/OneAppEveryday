var phantom = require('phantom');
var fs = require('fs');
var prompt = require('prompt');

prompt.start();

console.log('Please type filepath or drag and drop a image.');
prompt.get(['imagePath'], function (err, result) {
  if (err) { console.log(err); return;}
  console.log('Processing Image : ' + result.imagePath);
  var spaceCheck = result.imagePath.split(' ');
  readImage(spaceCheck[0]);
});

//read a image and convert to base64 before calling phantomjs
function readImage(path){
  fs.readFile(path, function(err, data){
    if(err){console.log('could not read the image file'); return;}
    
    //check if it is image file
    var imageExt = ['jpeg','jpg','png','gif','tiff'];
    var fileExt = path.split('.');
    var checkExist = imageExt.indexOf(fileExt[fileExt.length-1]); // -1 if the file extention does not exist in imageExt
    if (checkExist=== -1){
      console.log('File type not supported, please use '+ imageExt); 
      return;
    }

    //Convert image to base64 string and pass to PhantomJS
    var base64Image = data.toString('base64');
    callPhantom(base64Image);
  });
}

//PhantomJS process
function callPhantom(base64){
  phantom.create(function (ph) {
    ph.createPage(function (page) {

      page.set('onConsoleMessage', function (msg) {
        console.log('Phantom Console: ' + msg);
      });

      page.set('onCallback', function (data) {
        getAverageColor(data);
        ph.exit();
      });

      page.evaluate(
        function (imgString) { // imgString = base64
          var canvas = document.createElement( 'canvas' );
          var img = new Image();
          img.src = 'data:image/png;base64,' + imgString;
          //wait for image to load
          img.onload = function () { 
            //set canvas size
            canvas.width = img.width;
            canvas.height = img.height;
            //draw image onto canvas
            var ctx = canvas.getContext( '2d' );
            ctx.drawImage( img, 0, 0 ); 
            //wait for image to draw
            window.setTimeout(function(){
              //get RGBa data of each image
              var rgb = ctx.getImageData( 0, 0, img.width, img.height ).data;
              //callback
              window.callPhantom(rgb);
            },500);
          };
        },
        function(){},//callback, not used due to issuea with onload and setTimeout
        base64 //argument passed to 1st callback
      );

    });
  });
}

//Calcurate Average RGBa value
function getAverageColor (data){
  var averageRGBa = {R:[], G:[], B:[], a:[]};

  //extract values for RGBa and store as Array
  for (var i=0;i<data.length;i+=4){
    averageRGBa.R.push(data[i]);
    averageRGBa.G.push(data[i+1]);
    averageRGBa.B.push(data[i+2]);
    averageRGBa.a.push(data[i+3]);
  }
  //get sum of each array, then calcurate average and replace the value.
  for(i in averageRGBa){
    var sum = averageRGBa[i].reduce( function(total, num){ return total + num; }, 0);
    //replacing the array with average value
    averageRGBa[i] = Math.floor(sum/averageRGBa[i].length);
  }
  //get HEX code string
  var hex = '#' + ToHEX(averageRGBa.R) + ToHEX(averageRGBa.G) + ToHEX(averageRGBa.B);
  console.log('Average RGBa is : ' + JSON.stringify(averageRGBa));
  console.log('The HEX code is : ' + hex);
  if(averageRGBa.a !==255){
    console.log('This image has alpha channel, HEX color may not be the same as RGBa color to your eye');
  }
}

//Convert to HEX code
function ToHEX(n) {
  var hex = n.toString(16);
  hex = '00'.substr( 0, 2 - hex.length ) + hex;
 return hex;
}