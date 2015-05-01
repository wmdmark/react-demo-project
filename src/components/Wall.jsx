var fbMessagesStore = require("stores/messages-store")
var WallMessageList = require("components/WallMessageList")
var WallMessageForm = require("components/WallMessageForm")

var Wall = React.createClass({

  getInitialState: function() {
    return {messages: []}
  },

  componentWillMount: function() {
    //this.bindAsArray(fbMessagesStore, "messages");
    fbMessagesStore.on("value", function(snapshot) {
      var messages = []
      var messagesVal = snapshot.val()
      for (var key in messagesVal) {
        messages.push({id: key, message: messagesVal[key].message })
      }
      this.setState({messages: messages})
    }.bind(this))
  },

  componentWillUnmount: function() {
    fbMessagesStore.off("value")
  },

  render: function() {
    var messages = this.state.messages
    return (
      <div className='container'>
        <h1>Welcome to my Wall</h1>
        <hr />
        <WallMessageForm />
        <hr />
        <WallMessageList messages={messages} />
      </div>
    );
  }

});

module.exports = Wall