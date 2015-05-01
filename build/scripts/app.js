require.register("app", function(exports, require, module){
  var Wall = require("components/Wall")

var App = React.createClass({displayName: "App",
  render: function() {
    return React.createElement(Wall, null)
  }
})

React.render(React.createElement(App, null), document.getElementById("app"))
  
});

require.register("components/Wall", function(exports, require, module){
  var fbMessagesStore = require("stores/messages-store")
var WallMessageList = require("components/WallMessageList")
var WallMessageForm = require("components/WallMessageForm")

var Wall = React.createClass({displayName: "Wall",

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

module.exports = Wall
  
});

require.register("components/WallMessageForm", function(exports, require, module){
  var fbMessagesStore = require("stores/messages-store")

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

module.exports = WallMessageForm

  
});

require.register("components/WallMessageList", function(exports, require, module){
  var WallMessageListItem = require("components/WallMessageListItem")

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
module.exports = WallMessageList
  
});

require.register("components/WallMessageListItem", function(exports, require, module){
  var WallMessageForm = require("./WallMessageForm")
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

module.exports = WallMessageListItem
  
});

require.register("vendor/commonjs-require", function(exports, require, module){
  (function() {

  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var _definedModules = {};
  var _aliases = {};

  var Module = {
    _load: function(request, parent) {
      var name = Module._resolveFilename(request, parent);
      var definition = _definedModules[name];
      if (!definition) throw new Error('Cannot find module "' + name + '" from '+ '"' + parent + '"');

      if (Module._cache[name]) return Module._cache[name].exports;

      var localRequire = createLocalRequire(name);
      var module = {id: name, exports: {}};
      Module._cache[name] = module;
      definition.call(module.exports, module.exports, localRequire, module);
      return module.exports;
    },
    _cache: {},
    // TODO: Implement this to behave more like the Node environment
    _resolveFilename: function(request, parent) {
      var path = expand(dirname(parent), request);
      if (_definedModules.hasOwnProperty(path)) return path;
      path = expand(path, './index');
      if (_definedModules.hasOwnProperty(path)) return path;
      return request;
    }
  };

  var require = function(name, loaderPath) {
    return Module._load(name, loaderPath);
  };


  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();

  var createLocalRequire = function(parent) {
    return function(name) {
      return globals.require(name, parent);
    };
  };

  var dirname = function(path) {
    if (!path) return '';
    return path.split('/').slice(0, -1).join('/');
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (bundle.hasOwnProperty(key)) {
          _definedModules[key] = bundle[key];
        }
      }
    } else {
      _definedModules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in _definedModules) {
      if (_definedModules.hasOwnProperty(item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;

  require.define('module', function(exports, require, module) {
    module.exports = Module;
  });

})();
  
});

require.register("stores/messages-store", function(exports, require, module){
  module.exports = new Firebase("https://wmdmark.firebaseio.com/wall")
  
});

//# sourceMappingURL=app.js.map