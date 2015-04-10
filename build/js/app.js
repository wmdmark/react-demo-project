require.register("TimerApp", function(exports, require, module){
  var TimerList = require('components/TimerList')

var TimerApp = React.createClass({displayName: "TimerApp",
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("h1", null, "Timer app!"), 
        React.createElement(TimerList, null)
      )
    )
  }
})

React.render(React.createElement(TimerApp, null), document.getElementById('app'));
  
});

require.register("components/Timer", function(exports, require, module){
  
  
});

require.register("components/TimerList", function(exports, require, module){
  var TimerList = React.createClass({displayName: "TimerList",
  render: function(){
    return (
      React.createElement("div", {className: "timer-list-component"}, 
        React.createElement("h3", null, "Timer List Here"), 
        React.createElement("ul", {className: "timer-list"})
      )
    )
  }
})

module.exports = TimerList
  
});

//# sourceMappingURL=app.js.map