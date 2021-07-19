const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



mongoose.connect('mongodb+srv://localhost:27017/usertDB', {useNewUrlParser: true});

const userSchema={
  email:String,
  password:String
};

const User = mongoose.model('User', userSchema);



app.get("/" , function (req , res) {
  res.render("home");
});

app.get("/register" , function (req , res) {
  res.render("register");
});

app.get("/secrets" , function (req , res) {
  res.render("secrets");
});

app.get("/login" , function (req , res) {
  res.render("login");
});

app.post("/register" , function (req , res) {
 // User.insertOne({email:req.body.username , password: req.body.password} , function(err){
 //   if(!err){
 //     res.render("secrets");
 //   }
 // });

  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function (err) {
    if(!err){
       res.write("you successfuly register!")
      res.render("secrets");
    } else {
      res.send("faild " +err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
