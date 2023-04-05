//jshint esversion:6
require('mongodb')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.set('strictQuery', true); mongoose.connect('mongodb://127.0.0.1/cadDB');
mongoose.set('strictQuery', false);

const patientSchema = new mongoose.Schema ({
  email: String,
  password: String,
});
const PATIENT =  mongoose.model("Patient", patientSchema);
const proffesionalSchema = new mongoose.Schema ({
  email: String,
  password: String,
});
const PROFFESIONAL =  mongoose.model("Proffesional", proffesionalSchema);
app.get("/", function(req, res){
  res.render("home");
});

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


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
