

const bcrypt = require("bcryptjs"); 
const mongoose = require("mongoose");
var Schema = mongoose.Schema; 

var userSchema = new Schema({

    "userName": {type:String, unique:true}, 
    "password" : String,
    "email" : String,
    "loginHistory": [{

        "dateTime" : Date, 
        "userAgent" : String

    }]

}); 

let User; 

module.exports.initialize = function () {     
    return new Promise(function (resolve, reject) {         
       //let db = mongoose.createConnection("mongodb://rohil:1soccer@ds119223.mlab.com:19223/web322_a6"); 
       let db = mongoose.createConnection("mongodb://rohilkhakhar:1soccer@ds129454.mlab.com:29454/web322"); 
     // let db= mongoose.connect('mongodb://${rohil}:${ROhil1803*}@${ds119223.mlab.com}/${web322_a6}?authMechanism=SCRAM-SHA-1');
     
     
     
     db.on('error', (err)=>{             
            reject(err);     
        });         
        db.once('open', ()=>{            
            User = db.model("users", userSchema);            
            resolve();         
        });     
    }); 
}; 


module.exports.registerUser = function(userData){
     return new Promise(function (resolve, reject){

        if( userData.password != userData.password2 ){
            reject ("Passwords do not match");
        }
        else{        
            var newUser = new User(userData);
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userData.password, salt, function(err, hash) {
                    if (err){
                        reject("There was an error encrypting the password");
                    }
                    else{
                        newUser.password = hash;
                        newUser.save()
                        .then(()=>{
                            resolve();
                        })
                        .catch( (err)=>{
                            if (err.code == 11000){
                                reject("User Name already taken");                 
                            }
                            else{
                                reject("There was an error creating the user: err"+err);
                            }
                        }); 
                    }
                });
            });

        }

     });
}


module.exports.checkUser = function(userData){
    return new Promise(function (resolve, reject){

        User.find({ user: userData.userName })
        .exec()
        .then((users) =>{
            bcrypt.compare(userData.password, users[0].password )
            .then((res) => {
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.update({ userName: users[0].userName},
                            { $set: { loginHistory: users[0].loginHistory } },
                            { multi: false })
                .exec()
                .then( ()=>{
                    resolve(users[0]);
                })
                .catch((err)=>{
                    reject("There was an error verifying the user: " + err);
                });
            })
            .catch((err)=>{
                reject("Incorrect Password for user: " + userData.userName);
            })  
        })
    
    
        .catch((err) =>{
            reject("Unable to find user: " + userData.user);
        })

    });
} 

