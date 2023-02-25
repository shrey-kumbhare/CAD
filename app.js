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


mongoose.set('strictQuery', true); mongoose.connect('mongodb://127.0.0.1/userDB');
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
});
const USER =  mongoose.model("User", userSchema);
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});


app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){
  const user=new USER({
    username: req.body.username,
    password: req.body.password,
  });
  user.save();
  res.redirect("/");

});

app.post("/login", function(req, res){

  const user = new USER({
    username: req.body.username,
    password: req.body.password
  });

  USER.findOne(user, function(err){
    if (err) {
      console.log(err);
    } else {
        res.redirect("/");
    }
  });

});







app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
