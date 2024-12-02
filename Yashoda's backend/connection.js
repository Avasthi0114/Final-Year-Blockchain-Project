const mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

connection.connect((err) =>{
    if(!err){
        console.log("Connected");
    }
    else{
        console.log(err);
    }
});

module.exports = connection;

// const {Client} = require('pg')
// require('dotenv').config();

// const client = new Client({
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })

// client.connect((err) => {
//     if (!err) {
//         console.log("Connected to TestDB on port " + process.env.DB_PORT);
//         console.log("Server running on port " + process.env.PORT);
//     }
//     else {
//         console.log(err);
//     }
//     });

//  module.exports = client;