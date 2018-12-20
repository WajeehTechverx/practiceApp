const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../libs/middleware');
const User = require('../models/user');


router.get('/:id', (req,res) => {
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
});



router.delete('/:id', (req,res) => {
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
});


router.put('/:id', (req,res) => {
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
				user.save(function(err){
				if (err)
				{
					res.json({success: false, message: "Cant Update "+ err});
				}
				else
				res.json({success: true, message: "Updated", user: user});
				});
			}
		});
	}
});
module.exports =  router;

