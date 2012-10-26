(function() {
  var CELLS, DA_EXTEND, DA_SUBSCRIBE, DEBUG, Implementations, Protocols, alertable, dispatch_impl, register_protocol_impl, say, yui_draggable, yui_position_reporter;
  var __slice = Array.prototype.slice;

  DEBUG = true;

  DA_EXTEND = 'extend-with';

  DA_SUBSCRIBE = 'subscribe';

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  Protocols = {
    IDraggable: [['setX', ['x']], ['setY', ['y']], ['setXY', ['x', 'y']], ['onDragStart', ['f']], ['onDragStop', ['f']]],
    IPositionReporter: [['getX', []], ['getY', []], ['getXY', []]],
    IAlertable: [['alert', ['m']]]
  };

  Implementations = {};

  CELLS = {};

  dispatch_impl = function() {
    var node, protocol, rest;
    protocol = arguments[0], node = arguments[1], rest = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (Implementations[protocol]) {
      return Implementations[protocol](node);
    } else {
      return null;
    }
  };

  register_protocol_impl = function(protocol, impl) {
    return Implementations[protocol] = impl;
  };

  alertable = function(node) {
    return (function(node) {
      return {
        alert: function(m) {
          var t;
          t = node.getHTML();
          alert('hello', m);
          return t;
        }
      };
    })(node);
  };

  register_protocol_impl('IAlertable', alertable);

  yui_draggable = function(node) {
    return (function(node) {
      var dd;
      dd = new Y.DD.Drag({
        node: node
      });
      return {
        setX: function(x) {
          return node.setX(x);
        },
        setY: function(y) {
          return node.setY(y);
        },
        setXY: function(xy) {
          return node.setXY(xy);
        },
        onDragStart: function(f) {
          return dd.on('drag:start', f);
        },
        onDragStop: function(f) {
          return dd.on('drag:end', f);
        }
      };
    })(node);
  };

  register_protocol_impl('IDraggable', yui_draggable);

  yui_position_reporter = function(node) {
    return (function(node) {
      return {
        getX: function() {
          var x;
          x = node.getX();
          say(x);
          return "" + x + "px";
        },
        getY: function() {
          var y;
          y = node.getY();
          say(y);
          return y;
        },
        getXY: function() {
          var xy;
          xy = node.getXY();
          say(xy);
          return xy;
        }
      };
    })(node);
  };

  register_protocol_impl('IPositionReporter', yui_position_reporter);

  say(Implementations);

  YUI().use('node', 'event', 'dd', function(Y) {
    var x;
    say('Entering');
    if (DEBUG) window.Y = Y;
    x = Y.all("[data-" + DA_EXTEND + "]");
    x.each(function(node) {
      var new_cell, parse_genome, protocols;
      node.generateID();
      protocols = ((node.getData(DA_EXTEND)).split(" ")).filter(function(i) {
        return !!i;
      });
      say("Protocols found for " + node + ": " + protocols);
      new_cell = {
        id: node.id,
        "if": {}
      };
      protocols.map(function(protocol) {
        var impl_inst, p;
        p = Protocols[protocol];
        impl_inst = dispatch_impl(protocol, node);
        if (p && impl_inst) {
          return p.map(function(_arg) {
            var attrs, fn;
            fn = _arg[0], attrs = _arg[1];
            return new_cell["if"][fn] = impl_inst[fn];
          });
        }
      });
      CELLS[node.id] = new_cell;
      parse_genome = (require('genome-parser')).parse;
      return node.all("[data-" + DA_SUBSCRIBE + "]").each(function(s_node) {
        var handler, handler_name, handler_ns, proto_event, src_proto, subscriptions, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
        subscriptions = parse_genome(s_node.getData(DA_SUBSCRIBE));
        say("Subscriptions for " + s_node + ":", subscriptions);
        proto_event = (_ref = subscriptions.events[0]) != null ? _ref.event.name : void 0;
        src_proto = (_ref2 = subscriptions.events[0]) != null ? (_ref3 = _ref2.ns) != null ? _ref3.name : void 0 : void 0;
        handler_name = (_ref4 = subscriptions.handlers[0]) != null ? _ref4.method.name : void 0;
        handler_ns = (_ref5 = subscriptions.handlers[0]) != null ? (_ref6 = _ref5.ns) != null ? _ref6.name : void 0 : void 0;
        say("XXX:", proto_event, src_proto, handler_name, handler_ns);
        handler = function(ev) {
          say("Handler here:", proto_event, src_proto, handler_name, handler_ns);
          return s_node.setContent(new_cell["if"][handler_name]());
        };
        if (src_proto && proto_event) {
          return new_cell["if"][proto_event](handler);
        } else {
          return s_node.on(src_proto, handler);
        }
      });
    });
    say('Cells born for this document:', CELLS);
    return say("Exiting");
  });

}).call(this);
