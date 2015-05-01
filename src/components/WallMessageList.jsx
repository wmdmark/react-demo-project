var WallMessageListItem = require("components/WallMessageListItem")

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
module.exports = WallMessageList