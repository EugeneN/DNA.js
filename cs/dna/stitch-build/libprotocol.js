(function() {
  var Implementations, THIS, dispatch_impl, dump_impls, register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  Implementations = {};

  THIS = 'this';

  register_protocol_impl = function(protocol, impl) {
    say("Registering an implementation for the protocol " + protocol);
    return Implementations[protocol] = impl;
  };

  dispatch_impl = function() {
    var node, protocol, rest;
    protocol = arguments[0], node = arguments[1], rest = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    try {
      require(protocol);
    } catch (e) {
      say("Can't find a single module for an implementation of the protocol '" + protocol + "'");
    }
    if (Implementations[protocol]) {
      return Implementations[protocol](node);
    } else {
      return null;
    }
  };

  dump_impls = function() {
    return say("Currently registered implementations:", Implementations);
  };

  module.exports = {
    register_protocol_impl: register_protocol_impl,
    dispatch_impl: dispatch_impl,
    dump_impls: dump_impls
  };

}).call(this);
