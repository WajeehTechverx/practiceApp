require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
let mongoose = require('mongoose');
const URL = process.env.DB_URL;
//const port = 8080;
const users = require('./routes/user');

const app = express();
app.use(bodyParser.json());
const port = process.env.USRNAME;
console.log(port,"CJJFGJFGGFGHGFFGFJ")

//app.use(bodyParser.json());

// MongoDB configurations
mongoose.connect(URL,{
      auth: {
        user: process.env.USRNAME,
        password: process.env.PASSWORD
      }
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));


// Use Routes
app.use('/', users);

// Server Configurations
app.listen(process.env.PORT, function () {
    console.log("Server Running on Port " + process.env.PORT);
});