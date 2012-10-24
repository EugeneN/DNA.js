/* Cafe 4db6bf9b-da43-4620-a662-31874782bdd0 Wed Oct 24 2012 17:47:04 GMT+0300 (EEST) */
/* ZB:dna.js */
(function() {
  var DA_EXTEND, DEBUG, Implementations, MOLECULES, Protocols, alertable, dispatch_impl, register_protocol_impl, say, yui_draggable, yui_position_reporter;
  var __slice = Array.prototype.slice;

  DEBUG = true;

  DA_EXTEND = 'data-extend-with';

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

  MOLECULES = {};

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
    x = Y.all("[" + DA_EXTEND + "]");
    x.each(function(node) {
      var new_molecule, protocols;
      node.generateID();
      protocols = ((node.getData('extend-with')).split(" ")).filter(function(i) {
        return !!i;
      });
      say("Protocols found for " + node + ": " + protocols);
      new_molecule = {
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
            return new_molecule["if"][fn] = impl_inst[fn];
          });
        }
      });
      MOLECULES[node.id] = new_molecule;
      return node.all('[data-subscribe]').each(function(s_node) {
        var subscriptions;
        subscriptions = ((s_node.getData('subscribe')).split(" ")).filter(function(i) {
          return !!i;
        });
        return subscriptions.map(function(s) {
          var event, handler, handler_name, proto_event, src_proto, _ref, _ref2;
          _ref = s.split(':'), event = _ref[0], handler_name = _ref[1];
          _ref2 = event.split('.'), src_proto = _ref2[0], proto_event = _ref2[1];
          handler = function(ev) {
            say('drag end handler here');
            return s_node.setContent(new_molecule["if"][handler_name]());
          };
          if (src_proto && proto_event) {
            return new_molecule["if"][proto_event](handler);
          } else {
            return s_node.on(event, handler);
          }
        });
      });
    });
    say(MOLECULES);
    return say("Exiting");
  });

}).call(this);
;
