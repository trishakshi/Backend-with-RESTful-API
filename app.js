const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/login-db", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  fname: {type: String},
  lname: {type: String},
  email: {type: String, unique: true},
  username: {type: String, unique: true},
  password: {type: String}
});

const User = mongoose.model("User", userSchema);

app.post("/register", function(req, res){
  const newUser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if(!err) {
      res.send("User successfully registered.")
    } else {
      res.send(err);
    }
  })
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username}, function(err, user){
    if(err) {
      console.log(err);
    } else {
      if(user){
        if(user.password === password){
          res.send("User successfully logged in.");
        } else {
          res.send("Login failed!");
        }
      }
    }
  });
});

app.get("/login/:userName", function(req, res){
  User.findOne({username: req.params.userName}, function(err, user){
    if(!err){
      res.send(user);
    } else {
      console.log(err);
    }
  });
});

app.put("/login/:userName", function(req, res){
  User.updateOne({username: req.params.userName}, {fname: req.body.fname, lname: req.body.lname, username: req.body.username}, function(err){
    if(!err) {
      res.send("User data successfully updated.");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function(req, res){
  console.log("Server is running on port 3000.");
});
