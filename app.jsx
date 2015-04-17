var fbMessagesStore = new Firebase("<your-firebase-endpoint>")

var WallMessageList = React.createClass({

  renderMessage: function(message) {
    return (
      <li key={message.id} className="list-group-item">{message.message}</li>
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
    return { messageValue: "", character_count: 0 }
  },

  createMessage: function(e) {
    // add to firebase
    e.preventDefault()
    fbMessagesStore.push({message: this.state.messageValue})
    this.setState(this.getInitialState())
  },

  handleChange: function(e) {
    this.setState({
      messageValue: e.target.value,
      character_count: e.target.value.length
    })
  },

  render: function() {
    return (
      <div>
        <textarea className="form-control" rows="3" value={ this.state.messageValue } onChange={this.handleChange} />
        <div>{ this.state.character_count } characters</div>
        <button className="btn btn-primary" onClick={this.createMessage}>Submit Message</button>
      </div>
    )
  }

})

var Wall = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {messages: []}
  },

  componentWillMount: function() {
    this.bindAsArray(fbMessagesStore, "messages");
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