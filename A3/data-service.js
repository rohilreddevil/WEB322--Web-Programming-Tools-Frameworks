var fs= require('fs');
var EMPLOYEES= []; //global array declaration
var DEPARTMENTS= [];


module.exports.initialize= function () {
    
    return new Promise(function(resolve, reject)
    {

        //try { //error checking phase
            fs.readFile('./data/departments.json', function(err, data) //callback function
            {

                if(err){ reject (err);}
                DEPARTMENTS= JSON.parse(data);
            });
            fs.readFile('./data/employees.json', function(err, data)
            {

                if(err) {reject (err);}
                //DEPARTMENTS= JSON.parse(data); //parses a JSON string
              EMPLOYEES= JSON.parse(data);
                resolve();
            });
        });
        
    };
 


module.exports.getAllEmployees= function(){

    //var allemp= [];
    return new Promise(function(resolve, reject)
    { 
        if (EMPLOYEES.length==0) { //if length of the array is found to be 0
            reject("nothing found");
        }
    //resolve(allemp);
    resolve(EMPLOYEES);
    })

};

module.exports.getManagers = function(){

    return new Promise(function (resolve, reject){

        var allManagers= [];

       /*if(EMPLOYEES.length==0){
           reject('no results returned');
       }*/ //if there are no employees, then managers wouldn't be of any use
       //else{
        for (var j=0; EMPLOYEES.length; j++){
            if(EMPLOYEES[j].isManager==true){
                {
                    allManagers.push(EMPLOYEES[j]);
                }
            }
        if(allManagers.length==0){ //if this new array of managers is empty
            reject("nothing found");
        }
    }
    resolve(allManagers);
    });
};

module.exports.getDepartments = function(){

    //var DEPTS= [];

    return new Promise (function(resolve, reject){

        /*if(EMPLOYEES.length==0){
            reject('no results returned');
        } 
        else{
         for (var k=0; DEPARTMENTS.length; k++){
             DEPTS.push(DEPARTMENTS[k]);
         }*/
 
         if(DEPARTMENTS.length==0){ //if this new array of departments is empty
             reject('no results returned');
         }
        
     resolve(DEPARTMENTS);
     });
};

//new functions added here- as per assignment 3 requirements

//the addEmployee function
module.exports.addEmployee = function(employeeData){ //this is a promise driven function, similar to the other functions created in this file

return new Promise(function (resolve, reject){

    if (employeeData.isManager) { //if not undefined
        employeeData.isManager= true;
    }
    else{ // if undefined
        employeeData.isManager= false;
    }
    employeeData.employeeNum= EMPLOYEES.length +1;
    //push this new employee member to the existing array of Employees
    EMPLOYEES.push(employeeData);
    resolve(); //hence, function resolved
});
};

//new functions
module.exports.getEmployeesByStatus = function(status){ //this is a promise driven function, similar to the other functions created in this file

    return new Promise(function (resolve, reject){
    
        var newEMP = [];

        for(var i=0; i<EMPLOYEES.length;i++){
            if(EMPLOYEES[i].status == status){
                newEMP.push(EMPLOYEES[i]);
            }
           /* else{
                reject("Nothing Found");
            }*/
        }
        if(newEMP.length==0){
            reject("Nothing Found");
        }

        resolve(newEMP); //hence, function resolved
    });
    };

        module.exports.getEmployeesByDepartment = function(department){ //this is a promise driven function, similar to the other functions created in this file

        return new Promise(function (resolve, reject){
        
            var EMP = [];
    
            for(var i=0; i<EMPLOYEES.length;i++){
                if(EMPLOYEES[i].department == department){
                    EMP.push(EMPLOYEES[i]);
                }
            }
            if(EMP.length==0){
                reject("Nothing Found");
            }
          
            resolve(EMP); //hence, function resolved
        });
        };

        module.exports.getEmployeesByManager = function(manager){ //this is a promise driven function, similar to the other functions created in this file

            return new Promise(function (resolve, reject){
            
                var managerEMP = [];
        
                for(var i=0; i<EMPLOYEES.length;i++){
                    if(EMPLOYEES[i].manager == manager){
                        managerEMP.push(EMPLOYEES[i]);
                    }
                }
                if(managerEMP.length==0){
                    reject("Nothing Found");
                }
              
                resolve(managerEMP); //hence, function resolved
            });
            };

         module.exports.getEmployeeByNum = function(num){ //this is a promise driven function, similar to the other functions created in this file

                return new Promise(function (resolve, reject){
                
                    var EMP_num;
            
                    for(var i=0; i<EMPLOYEES.length;i++){
                        if(EMPLOYEES[i].num == num){
                            EMP_num = EMPLOYEES[i]; //store the matched employee in the new variable
                        }
                    }
                    if(EMP_num==0){
                        reject("Nothing Found");
                    }
                  
                    resolve(EMP_num); //hence, function resolved
                });
                };
















