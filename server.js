var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var Firebase = require("firebase")
var fbMessagesStore = new Firebase("https://wmdmark.firebaseio.com/wall")

// Twilio endpoint for incoming text messages
app.use(bodyParser.urlencoded({ extended: false }))
app.post("/new-message", function(req, res) {
  fbMessagesStore.push({message: req.body.Body})
  res.send(200)
})

app.get("/home", function(req, res) {
  res.send("<h1>Hi!</h1>")
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Listening at http://%s:%s', host, port)
})