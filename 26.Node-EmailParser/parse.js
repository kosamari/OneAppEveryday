var fs = require('fs');
var inbox = require('inbox');
var config = require('./config.json');
var MailParser = require("mailparser").MailParser;
var mailparser = new MailParser();

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

  reader.pipe(fs.createWriteStream('email.eml'), {end: false});

  reader.on('data', function(chunk){
    data += chunk;
  })
  //save as email file
  reader.on('end', function() {
    fs.createReadStream("email.eml").pipe(mailparser);
    mailparser.on("end", function(mail_object){
      fs.writeFile('parsed.html', mail_object.html, function(err) {
        if(err) {console.log(err);}
        console.log('New Email Parsed');
      });
    });
  });

});

imap.connect();




