var fbMessagesStore = require("stores/messages-store")

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

module.exports = WallMessageForm
