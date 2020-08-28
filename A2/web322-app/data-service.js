var EMPLOYEES= []; //global array declaration
var DEPARTMENTS= [];
const fs= require('fs');

module.exports.initialize= function () {
    
    return new Promise(function(resolve, reject)
    {

        try { //error checking phase
            fs.readFile('./data/employees.json', function(err, data) //callback function
            {

                if(err) throw err;
                EMPLOYEES= JSON.parse(data);
            });
            fs.readFile('./data/departments.json', function(err, data)
            {

                if(err) throw err;
                DEPARTMENTS= JSON.parse(data); //parses a JSON string
            });

        }catch(err) { //error handling phase
            reject('File cannot be read');
        }
            resolve('File read successfully');
    });
 
};

module.exports.getAllEmployees= function(){

    var allemp= [];
    return new Promise(function(resolve, reject)
    { 
        //will provide all the employees data if all goes well
        for(var i=0; i<EMPLOYEES.length;i++){

            allemp.push(EMPLOYEES[i]); //pushing all the employee data into this newly built array            

        }

        if (allemp.length==0) { //if length of the array is found to be 0
            reject('no results returned');
        }
    resolve(allemp);
    });

};

module.exports.getManagers = function(){

var allManagers= [];

    return new Promise(function (resolve, reject){

       if(EMPLOYEES.length==0){
           reject('no results returned');
       } //if there are no employees, then managers wouldn't be of any use
       else{
        for (var j=0; EMPLOYEES.length; j++)
            if(EMPLOYEES[j].isManager==true){
                {
                    allManagers.push(EMPLOYEES[j]);
                }
            }
        if(allManagers.length==0){ //if this new array of managers is empty
            reject('no results returned');
        }
    }
    resolve(allManagers);
    });
};

module.exports.getDepartments = function(){

    var DEPTS= [];

    return new Promise (function(resolve, reject){

        if(EMPLOYEES.length==0){
            reject('no results returned');
        } 
        else{
         for (var k=0; DEPARTMENTS.length; k++){
             DEPTS.push(DEPARTMENTS[k]);
         }
 
         if(DEPTS.length==0){ //if this new array of departments is empty
             reject('no results returned');
         }
        }
     resolve(DEPTS);
     });
};

