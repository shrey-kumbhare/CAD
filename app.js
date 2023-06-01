//jshint esversion:6
require('dotenv').config()
const dotenv=require('dotenv');
require('mongodb')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const passportLocalMongoose  = require("passport-local-mongoose");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var session = require('express-session')
const findOrCreate = require("mongoose-findorcreate");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', true); mongoose.connect('mongodb://127.0.0.1/cadDB');
mongoose.set('strictQuery', false);



const patientSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId:String
});
patientSchema.plugin(passportLocalMongoose);
patientSchema.plugin(findOrCreate);
const PATIENT =  mongoose.model("Patient", patientSchema);
const proffesionalSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId:String
});
proffesionalSchema.plugin(passportLocalMongoose);
proffesionalSchema.plugin(findOrCreate);
const PROFFESIONAL =  mongoose.model("Proffesional", proffesionalSchema);

app.get("/", function(req, res){
  res.render("home");
});



passport.use(PATIENT.createStrategy());

passport.use(PROFFESIONAL.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  PATIENT.findById(id, function(err, user) {
    done(err, user);
  });
  PROFFESIONAL.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  PATIENT.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
  PROFFESIONAL.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){

  const proffesional = new PROFFESIONAL({
    email: req.body.username,
    password: req.body.password
  });

  PROFFESIONAL.findOne(proffesional, function(err){
    if (err) {
      console.log(err);
    } else {
        res.redirect("/");
    }
  });

});
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const proffesional = new PROFFESIONAL({
    email: req.body.username,
    password: req.body.password
  });
  proffesional.save();
  res.redirect("/");

});

app.get("/PATIENTlogin", function(req, res){
  res.render("patientLogin");
});

app.post("/PATIENTlogin", function(req, res){

  const patient = new PATIENT({
    email: req.body.username,
    password: req.body.password
  });

  PATIENT.findOne(patient, function(err){
    if (err) {
      console.log(err);
    } else {
        res.redirect("/");
    }
  });

});
app.get("/PATIENTregister", function(req, res){
  res.render("patientRegister");
});

app.post("/PATIENTregister", function(req, res){
  const patient = new PATIENT({
    email: req.body.username,
    password: req.body.password
  });
  patient.save();
  res.redirect("/");


});
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);
app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/PATIENTlogin" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("https://www.google.com/");
  });

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
