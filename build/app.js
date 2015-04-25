var fbMessagesStore = new Firebase("https://wmdmark.firebaseio.com/wall")

var WallMessageListItem = React.createClass({displayName: "WallMessageListItem",

  getInitialState: function() {
    return {
      isEditing: false
    }
  },

  onClickEdit: function(e) {
    this.setState({isEditing: true})
  },

  closeEdit: function() {
    this.setState({isEditing: false})
  },

  render: function(){
    var message = this.props.message
    if (!this.state.isEditing) {
      return (
        React.createElement("li", {key: message.id, className: "list-group-item clearfix"}, 
          message.message, 
          React.createElement("a", {href: "#", className: "btn btn-default pull-right", onClick:  this.onClickEdit}, "Edit")
        )
      )
    } else {
      return(
        React.createElement(WallMessageForm, {message: message, onCancel: this.closeEdit, onSave: this.closeEdit})
      )
    }
  }


})

var WallMessageList = React.createClass({displayName: "WallMessageList",

  renderMessage: function(message) {
    return(
      React.createElement(WallMessageListItem, {message: message})
    )
  },

  render: function() {
    var messageListItems = this.props.messages.map(this.renderMessage)
    return (
      React.createElement("ul", {className: "list-group"},  messageListItems )
    )
  }

})
 
var WallMessageForm = React.createClass({displayName: "WallMessageForm",

  getInitialState: function() {
    var state = { messageValue: "" }

    if (this.props.message) {
      state.editMode = true
      state.messageValue = this.props.message.message
    }

    return state
  },

  saveMessage: function(e) {
    e.preventDefault()
    
    if (this.props.message) {
      console.log(this.props.message)
      var ref = fbMessagesStore.child(this.props.message.id)
      ref.set({message: this.state.messageValue})
    } else {
     fbMessagesStore.push({message: this.state.messageValue})
     this.setState(this.getInitialState())
    }

    if (this.props.onSave) {
      this.props.onSave()
    }


  },

  handleChange: function(e) {
    this.setState({
      messageValue: e.target.value
    })
  },

  onCancelEdit: function(e) {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  },

  render: function() {
    var characterCount = this.state.messageValue.length;
    return (
      React.createElement("div", null, 
        React.createElement("textarea", {className: "form-control", rows: "3", value:  this.state.messageValue, onChange: this.handleChange}), 
        React.createElement("div", null,  characterCount, " characters"), 
        React.createElement("button", {className: "btn btn-primary", onClick: this.saveMessage}, 
           this.state.editMode ? "Save Message" : "Submit Message"
        ), 
         this.state.editMode ? React.createElement("a", {href: "#", onClick:  this.onCancelEdit}, "Cancel") : ""
      )
    )
  }

})

var Wall = React.createClass({displayName: "Wall",

  //mixins: [ReactFireMixin],

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
      React.createElement("div", {className: "container"}, 
        React.createElement("h1", null, "Welcome to my Wall"), 
        React.createElement("hr", null), 
        React.createElement(WallMessageForm, null), 
        React.createElement("hr", null), 
        React.createElement(WallMessageList, {messages: messages})
      )
    );
  }

});

var App = React.createClass({displayName: "App",
  render: function() {
    return React.createElement(Wall, null)
  }
})

React.render(React.createElement(App, null), document.getElementById("app"))
//# sourceMappingURL=app.js.map