//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const {config} = require(__dirname + "/config.js"); 

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var token = config.MY_API_TOKEN;
var key = config.SECRET_API_KEY;
var list = config.MY_LIST_ID;

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  // console.log(firstName, lastName, email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us1.api.mailchimp.com/3.0/lists/" + list,
    method: "POST",
    headers: {
      "Authorization" : token + " " + key
    },
    body: jsonData
  };

  request(options, function(error, response, body){
    if(error){
      res.sendFile(__dirname + "/failure.html");
    }
    else{
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure.html" , function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server Started Successfully");
});
