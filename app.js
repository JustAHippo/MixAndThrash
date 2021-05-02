var express=require("express"); 
var bodyParser=require("body-parser"); 
  
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
mongoose.connect('MONGODB_STRING_HERE'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
var app=express() 
  
app.use(express.static(__dirname)); 
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
  
app.post('/sign_up', function(req,res){ 
    var name = req.body.name; 
    var email = req.body.email; 
    var pass = req.body.password; 
    let hash = bcrypt.hash(pass, 10, function(err, hash) {
        if(!err) {
            var data = { 
                "id": uuidv4(),
                "username": name, 
                "permissions": "1",
                "stars": 0,
                "joinDate": new Date(),
                "lastLogin": null,
                "ban": null, 
                "hash":hash, 
                "email":email
            } 
            db.collection('users').insertOne(data,function(err, collection){ 
                if (err) throw err; 
                console.log("Record inserted Successfully"); 
                return res.redirect('signup_success.html'); 
            });             
        }
        else res.sendStatus(500);
    });
});
    
app.get('/', function(req, res) {
    console.log("reached root!");
    res.redirect("/index.html");
});
app.get('/index.html', function(req, res) {
    console.log("reached root!");
    res.sendFile(__dirname + '/index.html');
});
app.listen(80);
  
  
console.log("server listening at port 80"); 