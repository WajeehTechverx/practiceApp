const mongoose = require('mongoose');
const Schema = mongoose.Schema;




let nameLenghtChecker = (fName) => {
	if(!fName || fName.length<3 || fName.length > 15)
		return false;
	else
		return true;
};

let validUserName = (fName) => {
	if(!fName || fName.length<3 || fName.length > 15)
		return false;
	else
	{
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regExp.test(fName);
	}
};

const nameValidators = [
	{validator: nameLenghtChecker,message: 'Name length must be greater than 3 and less than 15' },
	{validator: validUserName, message: 'Name must not have any special charactyers'}
	];



let emailLengthChecker = (email) => {
  if (!email || email.length < 5 || email.length > 30)
    return false;
  else
    return true;
};

let validEmailChecker = (email) => {
	if (!email)
    	return false;
    else
    {
	    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	    return regExp.test(email);
	}
};

const emailValidators = [
	{validator: emailLengthChecker,message: 'E-mail must be at least 5 characters but no more than 30'},
	{validator: validEmailChecker, message: 'Must be a valid e-mail'}
	];


let passwordLengthChecker = (password) => {
	if (!password || password.length < 8 || password.length > 35)
    	return false;
	else
    	return true;
};

let validPassword = (password) => {
	if (!password)
		return false;
	else
	{
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		return regExp.test(password);
	}
};

const passwordValidators = [
  {validator: passwordLengthChecker, message: 'Password must be at least 8 characters but no more than 35'},
  {validator: validPassword, message: 'Must have at least one uppercase, lowercase, special character, and number'}
  ];


// Create Schema
const UserSchema = new Schema({
  fName: { type: String, required: false, validate: nameValidators },
  lName: { type: String, required: false, validate: nameValidators },
  email: { type: String, required: false, validate: emailValidators, unique: true},
  password: { type: String, required: false, validate: passwordValidators }
});

module.exports = User = mongoose.model('user', UserSchema);


