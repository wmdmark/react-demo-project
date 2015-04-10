var TimerList = require('components/TimerList')

var TimerApp = React.createClass({
  render: function() {
    return (
      <div className='container'>
        <h1>Timer app!</h1>
        <TimerList />
      </div>
    )
  }
})

React.render(<TimerApp />, document.getElementById('app'));