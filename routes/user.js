const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// user Model
const User = require('../models/user');


function verifyToken(req, res, next)
{
	const bearerHeader = req.headers.authorization
	//console.log(bearerHeader);
	if(typeof bearerHeader !== 'undefined')
	{
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	}
	else
	{
		res.sendStatus(403);
	}
}



router.post('/logIn', (req, res) => {
	const user =
	{
    	email: req.body.email,
    	password: req.body.password
	}

	jwt.sign({user}, 'secretkey', (err, token) => {
		res.json({token});
	});
});

router.post('/signUp', (req, res) => {
	if (!req.body.fName || !req.body.lName || !req.body.email || !req.body.password)
    	res.json({ success: false, message: 'You must provide a params' });
    else
    {
    	const newUser = new User({
	    fName: req.body.fName,
	    lName: req.body.lName,
	    email: req.body.email,
	    password: req.body.password
		});
    	newUser.save().then(user => res.json(user));
    	
    }
});

router.get('/', verifyToken, (req,res) => {
	jwt.verify(req.token, 'secretkey', (err, data)=>{
		if(err)
			res.json(err);
		else
		{
			User.find().then(users => {
				console.log('Called Find All');
				if (!users  || users.length == 0) {
					res.json({ success: false, message: "No User Found"})
				}
				else 
				res.json({users: users})
			});

		}
	})

});


router.get('/:id', verifyToken, (req,res) => {
	jwt.verify(req.token, 'secretkey', (err, data)=>{
		if(err)
			res.json(err);
		else
		{
			if(!req.params.id)
				res.json({ success: false, message: 'ID was not provided' });
			else
			{
				User.findById({ _id: req.params.id }, (err, user) => {
			        if(err)
			        	res.json({ success: false, message: 'ID was not provided' });
			        else
			        	res.json({users: user});
		    	});
			}
		}
	})
});



router.delete('/:id', verifyToken, (req,res) => {
	jwt.verify(req.token, 'secretkey', (err, data)=>{
		if(err)
			res.json(err);
		else
		{
			if(!req.params.id)
				res.json({ success: false, message: 'ID was not provided' });
			else
			{
				User.deleteOne({_id: req.params.id} , (err , user) =>{
					if(err)
		        		res.json({ success: false, message: 'Not Deleted' });
		        	else
		        		res.json({ success: true, message: 'Deleted' });
				});
			}
		}
	})

});


router.put('/:id', verifyToken, (req,res) => {
	jwt.verify(req.token, 'secretkey', (err, data)=>{
		if(err)
			res.json(err);
		else
		{
			if(!req.params.id)
				res.json({ success: false, message: 'ID was not provided' });
			else
			{
				User.findById(req.params.id, function(err, user) {
		  			if (err)
		  				res.json({ success: false, message: 'Not User With this ID' });
		  			else
		  			{
		  				user.fName = req.body.fName;
				    	user.lName = req.body.lName;
				    	user.email = user.email;
				    	user.password = req.body.password;
				    	user.save(function(err) {
			    			if (err)
			    			{
			    				console.log(err,"ERROR")
			    				res.json({success: false, message: "Cant Update "+ err});
							}
			    			else
			    				res.json({success: true, message: "Updated"});
			  			});
		  			}
		  		});
			}
		}
	})

});



// function (req, res) {
//     Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
//         if (err) return next(err);
//         res.send('Product udpated.');
//     });





module.exports =  router;