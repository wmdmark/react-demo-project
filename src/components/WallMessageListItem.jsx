var WallMessageForm = require("./WallMessageForm")
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

module.exports = WallMessageListItem