var fs = require('fs');
var contents = fs.readFileSync('./views/email/confirmEmail.html', 'utf8');
const BaseMailer = require('../libs/mailer');

const emailSender = (userEmail,token)=>{
  const activationLink = "http://127.0.0.1:8080/activation/"+token;
  contents = contents.replace("ACTIVATIONLINK",activationLink);
    const options = {
      from: 'Localhost Staff, staff@localhost.com',
      to: userEmail,
      subject: 'Localhost Activation Link',
      html: contents
    };
    BaseMailer(options);
}
module.exports = emailSender;