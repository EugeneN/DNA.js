(function() {
  var Implementations, dispatch_handler, dispatch_impl, register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  Implementations = {};

  register_protocol_impl = function(protocol, impl) {
    return Implementations[protocol] = impl;
  };

  dispatch_impl = function() {
    var node, protocol, rest;
    protocol = arguments[0], node = arguments[1], rest = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (Implementations[protocol]) {
      return Implementations[protocol](node);
    } else {
      return null;
    }
  };

  dispatch_handler = function(current_cell, handler_ns, fn) {
    if (current_cell.receptors[fn]) {
      return current_cell.receptors[fn];
    } else {
      say("Handler missing for " + fn + " @ " + handler_ns);
      return function() {
        return say("Missing handler " + fn + " @ " + handler_ns);
      };
    }
  };

  module.exports = {
    register_protocol_impl: register_protocol_impl,
    dispatch_impl: dispatch_impl,
    dispatch_handler: dispatch_handler
  };

}).call(this);
