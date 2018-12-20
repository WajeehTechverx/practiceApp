const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req,res) => {
	User.find().then(users => {
		if (!users  || users.length == 0) {
			res.json({ success: false, message: "No User Found"})
		}
		else 
			res.json({users: users});
	});

});

module.exports = router;