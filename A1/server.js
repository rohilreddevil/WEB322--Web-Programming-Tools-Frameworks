/********************************************************************************* *  
 * WEB322: Assignment 1 *  
 * I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 *  No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. 
 * 
 *  Name: ___Rohil Kalpesh Khakhar___________________ Student ID: __109270173____________ Date: _10th September 2018_______________ 
 * 
 *  Online (Heroku) URL: __https://frozen-journey-81377.herokuapp.com/_____________________________________________________ 
 * 
 * * ********************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const Sequelize = require('sequelize');


var sequelize = new Sequelize('dc3q8c40cge325', 'mmjdyrilwggnrv', 'e0f6e5ffd4b52c151ced35d57a73965b8e1fda65688f8f3b85894fcca6a9d1cd', {
    host: 'ec2-54-221-234-62.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

sequelize
    .authenticate()
    .then(function() {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Rohil Khakhar - 109270173");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);

