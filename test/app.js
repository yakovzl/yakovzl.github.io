require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
//const encrypt = require('mongoose-encryption');
//var md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(session({
  secret: 'Our little secret.',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const userSchema=new mongoose.Schema({
  email:String,
  password:String,
  googleId:String,
  secret:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
//                                 level 2 encription!!!
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['age'] });
//

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect secrets.
      res.redirect('/secrets');
    });

app.get("/" , function (req , res) {
  res.render("home");
});

app.get("/register" , function (req , res) {
  res.render("register");
});

app.get("/secrets" , function (req , res) {


  //////////if you want that only loged in user will see secrets/////////////


  // if(req.isAuthenticated()){
  //   res.render("secrets");
  // } else {
  //   res.redirect("/login");
  // }

  User.find({"secret":{$ne:null}} , function (err , foundUsers) {
    if(err){
      console.log(err);
    } else{
      if(foundUsers){
        res.render("secrets" , {secret:foundUsers} );
      }
    }
  });
});


app.get("/submit" , function (req , res) {
  if(req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get("/login" , function (req , res) {
  res.render("login");
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



app.post("/register" , function (req , res) {
  User.register({username:req.body.username}, req.body.password, function(err, user) {
  if (err) {
  console.log(err);
  res.redirect("/register");
} else {
  passport.authenticate("local")(req , res , function () {
    res.redirect("/secrets");
  });
}
});
});

app.post('/login', passport.authenticate('local',
 { successRedirect: '/secrets',  failureRedirect: '/login' ,  }));

app.post("/submit" , function (req , res) {
  console.log(req.user);
  const secret=req.body.secret;
  User.findById(req.user.id,function (err ,foundUser) {
    if(err){
      console.log(err);
    } else{
      if(foundUser){
       foundUser.secret=secret;
       foundUser.save(function(err){
         res.redirect("/secrets");
       });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 5000");
});
