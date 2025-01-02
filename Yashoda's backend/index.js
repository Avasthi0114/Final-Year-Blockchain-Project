 const express = require('express');
 var cors = require('cors');
 
 const connection = require('./connection');
 const userRoute = require('./routes/user');
 const app = express();
 const QRCode = require('qrcode');
 
 app.use(cors());
 app.use(express.urlencoded({extended: true}));
 app.use(express.json());
 app.use('/user', userRoute);

 
 
  
 module.exports = app;


