var Wall = require("components/Wall")

var App = React.createClass({
  render: function() {
    return <Wall/>
  }
})

React.render(<App/>, document.getElementById("app"))