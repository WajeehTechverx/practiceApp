require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
let mongoose = require('mongoose');
const mWare = require('./libs/middleware');
const URL = process.env.DB_URL;
const verify = require('./libs/middleware');
const authenticateRoutes = require('./routes/authenticate');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
app.use(bodyParser.json());

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
app.use('/admin', verify,adminRoutes);
app.use('/users', verify,userRoutes);
app.use('/',authenticateRoutes);
//app.use('/',regestrationRoutes);

// Server Configurations
app.listen(process.env.PORT, function () {
    console.log("Server Running on Port " + process.env.PORT);
});