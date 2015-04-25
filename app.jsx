var fbMessagesStore = new Firebase("https://wmdmark.firebaseio.com/wall")

var WallMessageListItem = React.createClass({

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
        <li key={message.id} className="list-group-item clearfix">
          {message.message}
          <a href="#" className="btn btn-default pull-right" onClick={ this.onClickEdit } >Edit</a>
        </li>
      )
    } else {
      return(
        <WallMessageForm message={message} onCancel={this.closeEdit} onSave={this.closeEdit} />
      )
    }
  }


})

var WallMessageList = React.createClass({

  renderMessage: function(message) {
    return(
      <WallMessageListItem message={message} />
    )
  },

  render: function() {
    var messageListItems = this.props.messages.map(this.renderMessage)
    return (
      <ul className="list-group">{ messageListItems }</ul>
    )
  }

})
 
var WallMessageForm = React.createClass({

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
      <div>
        <textarea className="form-control" rows="3" value={ this.state.messageValue } onChange={this.handleChange} />
        <div>{ characterCount } characters</div>
        <button className="btn btn-primary" onClick={this.saveMessage}>
          { this.state.editMode ? "Save Message" : "Submit Message" }
        </button>
        { this.state.editMode ? <a href='#' onClick={ this.onCancelEdit }>Cancel</a> : "" }
      </div>
    )
  }

})

var Wall = React.createClass({

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

var App = React.createClass({
  render: function() {
    return <Wall/>
  }
})

React.render(<App/>, document.getElementById("app"))