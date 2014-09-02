var inbox = require('inbox');
var config = require('./config.json');

var imap = inbox.createConnection(
  false, 'imap.gmail.com', {
    secureConnection: true,
    auth: config
  }
);

imap.on('connect', function(){
  console.log('connected');
  imap.openMailbox('INBOX', function(error){
    if(error) throw error;
  });
});

imap.on('new', function(message){

  var reader = imap.createMessageStream(message.UID)
  var data = '';

  reader.pipe(process.stdout, {end: false});

  reader.on('data', function(chunk){
    data += chunk;
  })

  reader.on('end', function() {
    var reg = /\<html\>.+?\<\/html\>/;
    var oneline= data.split('\n').join('');
    console.log(oneline.match(reg));
  });

});

imap.connect();

