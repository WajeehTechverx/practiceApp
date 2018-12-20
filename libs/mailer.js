const nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth:{
        user: process.env.AUTHOR_EMAIL,
        pass: process.env.AUTHOR_MAIL_PASSWORD
      }
    });

    const sendEmail = (options) => {
    	transporter.sendMail(options, (error, info) => {
    		if (error) {
    			return console.log(error);
    		}
    		console.log('Message sent\nTemporary Token is: '+token);
    	});
    }


module.exports = sendEmail;