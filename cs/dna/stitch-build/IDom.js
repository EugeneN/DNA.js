(function() {
  var register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  register_protocol_impl('IDom', function(node) {
    return (function(node) {
      return {
        setContent: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return node.setContent(args[0]);
        },
        appendContent: function(content) {
          return node.append("<div>" + content + "</div>");
        },
        alert: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return alert.apply(null, args);
        },
        click: function(handler) {
          return node.on('click', handler);
        },
        say: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return say.apply(null, args);
        },
        proxylog: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          say.apply(null, args);
          return args;
        },
        kill: function() {
          return say('kill');
        }
      };
    })(node);
  });

}).call(this);
