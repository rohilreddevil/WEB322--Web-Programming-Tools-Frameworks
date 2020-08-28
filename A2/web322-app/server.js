/********************************************************************************* 
 * *  WEB322 – Assignment 02 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 * No part of this assignment has been copied manually or electronically from any other source  
 * *  (including 3rd party web sites) or distributed to other students. *  
 * *  Name: ___Rohil Khakhar___________________ Student ID: ____109270173__________ Date: _____27/09/2018___________ * 
 * *  Online (Heroku) Link: ________________________________________________________ 
 * * ********************************************************************************/

//var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path= require('path');
var DATA= require("./data-service.js");
var app = express();



var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
  return new Promise (function (req,res){
  
    DATA.initialize()
    .then(function(data)//if successful
    {console.log(data)}
    )
    .catch(function(err)
    {console.log(err)}
    )
  });
};

app.use(express.static('public')); 
// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", function(req,res) {
    //const home = req.home;
    res.sendFile(path.join(__dirname, "/views/home.html" ));
});


app.get("/", function(req,res) {
  //const home = req.home;
  res.sendFile(path.join(__dirname, "/views/about.html" ));
});

app.get('/employees', function(req, res){

  DATA.getAllEmployees() 
    .then(data => res.json(data)) //anonymous function.. using the fat arrow syntax
    .catch(err => res.json({message:err})); //catches the error message
});
app.get('/managers', function(req, res){ //get data from the managers

  DATA.getManagers() 
    .then(data => res.json(data)) //anonymous function.. if promise is fulfilled, the json file will be returned
    .catch(err => res.json({message:err}));
});
app.get('/departments', function(req, res){

  DATA.getDepartments()
    .then(data => res.json(data)) //anonymous function.. returns json data if the function was successful
    .catch(err => res.json({message:err})); // returning a simple JSON object with a message property
});

// We use this function to handle 404 requests to pages that are not found.

app.use(function (req,res){ //callback function 
  res.status(404).send('404 Page Not Found'); //sending the error status to the server
});



// listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);