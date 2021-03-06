express = require('express')
app = express()
bodyParser = require('body-parser')

twilio = require('twilio')
client = twilio("<key>", "<token>")

Firebase = require("firebase")
fbMessagesStore = new Firebase("https://wmdmark.firebaseio.com/messages")

storedMessages = []

fbMessagesStore.on "value", (snapshot) ->
  storedMessages = []
  messages = snapshot.val()
  for key, message of messages
    storedMessages.push(message.message)

getResponse = (message, callback)->
  response = null
  switch message.toLowerCase()
    when "/list"
      if storedMessages.length > 0
        response = "\n#{storedMessages.join("\n - ")}"
      else
        response = "list is empty!"
    when "/clear"
      fbMessagesStore.remove()
      response = "list removed!"
    else
      fbMessagesStore.push({message: message})
  callback(response)

# Twilio endpoint for incoming text messages
app.use bodyParser.urlencoded(extended: false)
app.post '/new-message', (req, res) ->
  message = req.body.Body
  getResponse message, (response)->
    if response
      resp = new twilio.TwimlResponse()
      resp.message(response)
      res.writeHead(200, "Content-type": "text/xml")
      res.end(resp.toString())
    else
      res.send(200)

server = app.listen(3000, ->
  host = server.address().address
  port = server.address().port
  console.log 'Movie bot listening at http://%s:%s', host, port
)