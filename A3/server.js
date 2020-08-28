/********************************************************************************* 
 * *  WEB322 – Assignment 03 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 * No part of this assignment has been copied manually or electronically from any other source  
 * *  (including 3rd party web sites) or distributed to other students. *  
 * *  Name: ___Rohil Khakhar___________________ Student ID: ____109270173__________ Date: _____09/10/2018___________ * 
 * *  Online (Heroku) Link: ____________https://tranquil-thicket-28513.herokuapp.com/____________________________________________ 
 * * ********************************************************************************/


var express = require("express");
var path= require('path');
var data= require("./data-service.js");
var app = express();
var multer = require("multer"); //requiring the multer module- a middleware for handling 'multipart/form_data', used for file upload
var fs = require('fs');//new addition
var bodyParser= require('body-parser'); //new addition
//defining an upload variable that manages file upload onto the site
var upload= multer({ storage: storage });

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
/*function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
  return new Promise (function (req,res){*/
  
    data.initialize().then(function(data){//if successful
    app.listen(HTTP_PORT, function(){
    console.log("Express http server listening on: " + HTTP_PORT)
    });})
    .catch(function(err){
    console.log("File Cannot be read " + err);
    
  });


//adding the storage variable (multer.diskStorage) aka the MULTER MIDDLEWARE FUNCTION TO PROCESS THE FILE UPLOAD
//this will henceforth be added to the REQUEST object.. with the body being in req.body and the file in req.file
var storage= multer.diskStorage({
  destination:"./public/images/uploaded", //this is the file where the uploaded images should be stored
  filename: function (req, file, cb) {  //determines what the file should be named inside that particular folder      
    cb(null, Date.now() + path.extname(file.originalname)); 
} //request object, and some information about the file (file parameter)
});

//defining an upload variable that manages file upload onto the site
//var upload= multer({ storage: storage }); 

//adding the POST route to send back the response, as well as the uploaded image
app.post('/images/add', upload.single("imageFile"), function(req, res){ 
    res.redirect("/images"); //this route will redirect to this page on the website
});

//adding another GET method 
app.get("/images", function(req, res){

  fs.readdir("./public/images/uploaded" , function(err, items){ //items is an array of the name of the files
    res.json({images:items}); //returning the whole array of a JSON formatted string containing the images..  
  // return res.json("images");
    }); //the images property specified in res.json() contains the contents of the /public/images/uploaded directory
});//fs.readdir- allows us to read the contents of the /uploaded directory


//adding the bodyparser middleware using app.use
app.use(bodyParser.urlencoded({ extended: true }));


//FURTHER POST METHOD- addEmployee() FUNCTION CALL
app.post("/employees/add", function(req, res){  
  data.addEmployee(req.body) //this function is yet to be created and will be present in data-service.js
  //req.body equivalent to employeeData
  .then(() => {res.redirect("/employees");}); //next step- when this function resolves successfully, redirect to /employees
});

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

//new updates to cater to assignment 3 requirements
app.get('/employees/add' , function(req, res){
  res.sendfile(path.join(__dirname, "/views/addEmployee.html"));
}); // get data for the /employees/add route and subsequently call the callback function on it

//adding another app method to GET data for the /images/add route
app.get('/images/add' , function(req, res){
  res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.get('/employees', function(req, res){
  
  //new modifications as per the new functions
if (req.query.status) { //provisional syntax
  data.getEmployeesByStatus(status) //if a value does exist
  .then((data) => {res.json(data);}) //anonymous function.. using the fat arrow syntax
  .catch((err) => {res.json({message:"no outcome"});}); //catches the error message
}
else if (req.query.department) {
    data.getEmployeesByDepartment(department)
    .then((data) => {res.json(data);}) //anonymous function.. using the fat arrow syntax
    .catch((err) => {res.json({message:"no outcome"});}); //catches the error message
}
else if (req.query.manager) {
  //else if ('/employees?manager=value') {
  data.getEmployeesByManager(manager)
  .then((data) => {res.json(data);}) //anonymous function.. using the fat arrow syntax
  .catch((err) => {res.json({message:"no outcome"});}); //catches the error message
}
else{ data.getAllEmployees() //returns a JSON string containing all employees
  .then((data) => {res.json(data);}) //anonymous function.. using the fat arrow syntax
  .catch((err) => {res.json({message:"no outcome"});}); //catches the error message
  } 
});

//adding the new '/employee/value' route
app.get('/employee/value', function(req,res){
  //data.getEmployeeByNum(req.params.value)
  data.getEmployeeByNum(num)
  .then((data) => {res.json(data);}) //anonymous function.. using the fat arrow syntax
  .catch((err) => {res.json({message:"no outcome"});}); //catches the error message

});



app.get('/managers', function(req, res){ //get data from the managers

  data.getManagers() 
    .then(data => res.json(data)) //anonymous function.. if promise is fulfilled, the json file will be returned
    .catch(err => res.json({message:err}));
});
app.get('/departments', function(req, res){

  data.getDepartments()
    .then(data => res.json(data)) //anonymous function.. returns json data if the function was successful
    .catch(err => res.json({message:err})); // returning a simple JSON object with a message property
});

// We use this function to handle 404 requests to pages that are not found.

app.use(function (req,res){ //callback function 
  res.status(404).send('404 Page Not Found'); //sending the error status to the server
});



// listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
//app.listen(HTTP_PORT, onHttpStart);