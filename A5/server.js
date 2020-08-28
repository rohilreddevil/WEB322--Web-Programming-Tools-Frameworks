/********************************************************************************* 
 * *  WEB322 – Assignment 06 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 * No part of this assignment has been copied manually or electronically from any other source  
 * *  (including 3rd party web sites) or distributed to other students. *  
 * *  Name: ___Rohil Khakhar___________________ Student ID: ____109270173__________ Date: __07/12/2018______________ * 
 * *  Online (Heroku) Link: ____________________ https://tranquil-thicket-28513.herokuapp.com/____________________________________ 
 * * ********************************************************************************/

const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const fs = require("fs");
const path = require("path");
const DATA = require("./data-service.js");

const clientSessions = require("client-sessions");

const dataServiceAuth = require("./data-service-auth.js");


var app = express();

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {

        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");

            if (lvalue != rvalue)
                return options.inverse(this);
            else
                return options.fn(this);
        }
    }
}));




app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.set('view engine', '.hbs');
app.use(express.static('public'));


app.use(clientSessions({
    cookieName: "session", 
    secret: "week10example_web322", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
  }));

  
  app.use(function(req, res, next) {   
      res.locals.session = req.session;   
      next(); 
    }); 

    

    function ensureLogin(req, res, next) {
        if (!(req.session.user)) {
          res.redirect("/login");
        } else {
          next();
        }
      }

app.use(bodyParser.urlencoded({ extended: true }));

var HTTP_PORT = process.env.PORT || 8080;



function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}



app.get("/", function (req, res) {
    
    res.render("home");
});


app.get("/about", function (req, res) {
    
    res.render("about");
});


app.get("/employees/add", ensureLogin,  (req, res) => {
    

    DATA.getDepartments()
        .then((data) => {
            res.render("addEmployee", { departments: data });
        })
        .catch((err) => {
            res.render("addEmployee", { departments: [] });
        })

});



app.get("/images/add", ensureLogin,  (req, res) => {
    
    res.render("addImage");
});



const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });



app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});



app.get("/images", ensureLogin,  (req, res) => {
  

    fs.readdir(path.join(__dirname, "./public/images/uploaded" ), function (err, items) {
        var imageObj = { images: [] };
        for (var i = 0; i < items.length; i++) {
            imageObj.images.push(items[i]);
        }
        

        res.render('images', imageObj);
    })
});



app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
    .then(() =>{
        res.render("register",{successMessage: "User created"} );
    })
    .catch((err) =>{
        res.render("register",{errorMessage: err, userName: req.body.userName});
    })
});

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent'); 
    dataServiceAuth.checkUser(req.body).then((user) => {     
        req.session.user = {         
            userName: user.userName,         
            email: user.email,     
            loginHistory: user.loginHistory   
        } 
 
    res.redirect('/employees'); 
}) 
    .catch((err) => {
        res.render("login",{errorMessage: err, userName: req.body.userName})
    })

});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
    res.render("userHistory");
});



app.get("/employees", ensureLogin, function (req, res) {

    if (req.query.status) {
        DATA.getEmployeesByStatus(req.query.status)
            .then((data) => {
            
                res.render("employees", { employees: data });
            })
            .catch((err) => {
               
                res.render({ message: "no results" });
            })
    }
    else if (req.query.department) {
        DATA.getEmployeesByDepartment(req.query.department)
            .then((data) => {
              
                res.render("employees", { employees: data });
            })
            .catch((err) => {
               
                res.render({ message: "no results" });
            })
    }
    else if (req.query.manager) {
        DATA.getEmployeesByManager(req.query.manager)
            .then((data) => {
              
                res.render("employees", { employees: data });
            })
            .catch((err) => {
           
                res.render({ message: "no results" });
            })
    }
    else {
        DATA.getAllEmployees()
            .then((data) => {
                if (data.length > 0)
                    res.render('employees', { employees: data });
                else
                    res.render('employees', { message: "no results" });
            })
            .catch((err) => {
                res.render("employees", { message: "no results" });
            })
    }
});

app.get("/employee/:value", ensureLogin,  (req, res) => {

    
    let viewData = {};
    DATA.getEmployeeByNum(req.params.value).then((data) => {
        if (data) {
            viewData.employee = data; 
        } else {
            viewData.employee = null; 
        }
    }).catch(() => {
        viewData.employee = null; 
    }).then(DATA.getDepartments)
        .then((data) => {
            viewData.departments = data; 
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; 
        }).then(() => {
            if (viewData.employee == null) { 
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); 
            }
        });
});

app.post("/employee/update", ensureLogin,  (req, res) => {
    DATA.updateEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        })
        .catch((err) => {
            res.json(err);
        })
});


app.get("/departments", ensureLogin,  function (req, res) {

    DATA.getDepartments()
        .then((data) => {
            if (data.length > 0)
                res.render("departments", { departments: data });
            else
                res.render("departments", { message: "no results" });
        })
        .catch((err) => {
            res.render("departments", { message: "no results" });
        })
});
app.post("/employees/add", ensureLogin,  function (req, res) {
    DATA.addEmployee(req.body)
        .then((data) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            res.json(err);
        })
});




DATA.initialize() 
.then(dataServiceAuth.initialize) 
.then(function(){     
    app.listen(HTTP_PORT, function(){         
        console.log("app listening on: " + HTTP_PORT)     
    }); 
}).catch(function(err){     
    console.log("unable to start server: " + err); 
}); 
 



app.get("/departments/add", ensureLogin,  (req, res) => {
   
    res.render("addDepartment");
});



app.post("/departments/add", ensureLogin,  function (req, res) {
    DATA.addDepartment(req.body)
        .then((data) => {
            res.redirect("/departments");
        })
        .catch((err) => {
            res.json(err);
        })
});


app.post("/department/update", ensureLogin,  (req, res) => {
    DATA.updateDepartment(req.body)
        .then(() => {
            res.redirect("/departments");
        })
        .catch((err) => {
            res.json(err);
        })
});

app.get("/department/:departmentId", ensureLogin,  (req, res) => {
    DATA.getDepartmentById(req.params.departmentId)
        .then((data) => {
            if (data)
                res.render("department", { department: data });
            else
                res.status(404).send("Department Not Found");
        })
        .catch((err) => {
            res.status(404).send("Department Not Found");
        })
});

app.get("/departments/delete/:departmentId", ensureLogin,  (req, res) => {
    DATA.deleteDepartmentById(req.params.departmentId)
        .then((data) => {
            res.redirect("/departments");
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Department / Department not found");
        })
});



app.get("/employees/delete/:empNum", ensureLogin,  (req, res) => {
    DATA.deleteEmployeeByNum(req.params.empNum)
        .then((data) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Employee / Employee not found");
        })
});


