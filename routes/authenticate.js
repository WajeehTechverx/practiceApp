const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const emailSender = require('../helpers/confirmationEmail');

router.post('/logIn', (req, res) => {
	User.findOne({email:req.body.email}, function(err, data){
        if(err)
        {
             res.json({
                 status: 0,
                 message: err
             });
        }
        else
        if(!data || data.email!=req.body.email)
        {
            res.json({
                status: 0,
                msg: "Record not found"
            });
        }
        else
        {
            const validPassword = data.comparePassword(req.body.password);
            if(validPassword)
            {
                if(data.active)
                {
                    const user =
                    {
                        fName: data.fName,
                        lName: data.lName,
                        email: data.email,
                        password: data.password,
                        role: data.role

                    }
                    jwt.sign({user}, process.env.SECRET_KEY, { expiresIn: '1d' } , (err, token) => {
                        res.json({token});
                    });
                }
                else
                    res.send("User is not active. Check your email, click on activation and the log in again");
                
            }
            else
            {
                res.json({
                    msg: "Incorrect Password"
                });
            }
        }

    });
});

router.post('/signUp', (req, res) => {
    if (!req.body.fName || !req.body.lName || !req.body.email || !req.body.password)
        res.json({ success: false, message: 'You must provide all fields' });
    else
    {
        const newUser = new User({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: req.body.password,
        temporarytoken: Math.random().toString(36),
        location:{long:"0",lat:'0'},
        role: 'User'
        });
        newUser.save(function(err){
            if (err)
            {
                if (err.name === 'MongoError' && err.code === 11000)
                    return res.status(500).send({ succes: false, message: 'User already exist!' });
                else

                return res.json({msg:err.message});
            }
            else
            {   emailSender(newUser.email,newUser.temporarytoken);
                res.json({message: "Signup success, Please validate your email: " + req.body.email});
            }
        });
        
    }
});
router.get('/activation/:token', (req, res) => {
    
    User.findOne({temporarytoken: req.params.token},function(err , newUser){
        if(err || !newUser)
            res.send("Activation Failed\nMay be there is some corruption in activation link or user is already active(check by logging in)");//no user found with this token
        else
        {


            newUser.active = true;
                newUser.temporarytoken = null;
                newUser.save(function(err){
                    if (err)
                    {
                        return res.json({msg:err.message});
                    }
                    else
                    {
                        res.send("User Activated.\nEnjoy the services");    
                    }
                });
        }
    });
});
    

module.exports =  router;