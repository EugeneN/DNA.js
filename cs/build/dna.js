(function() {
  var CELLS, DA_EXTEND, DA_SUBSCRIBE, DEBUG, DEFAULT_PROTOCOLS, Implementations, Protocols, alertable, dispatch_handler, dispatch_impl, dom_impl, parse_ast_node, register_protocol_impl, say, synthesize_cell, yui_draggable, yui_position_reporter;
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
    IAlertable: [['alert', ['m']]],
    IDom: [['setContent', ['new_content']]]
  };

  DEFAULT_PROTOCOLS = ['IDom'];

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

  dom_impl = function(node) {
    return (function(node) {
      return {
        setContent: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          say('IDom impl', node, args);
          return node.setContent(args);
        }
      };
    })(node);
  };

  register_protocol_impl('IDom', dom_impl);

  alertable = function(node) {
    return (function(node) {
      return {
        alert: function(m) {
          var t;
          t = node.getHTML();
          say('====>', m);
          alert("<" + m + ">");
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

  dispatch_handler = function(current_ns, handler_ns, fn) {
    say('>>>>', current_ns, handler_ns, fn);
    if (current_ns["if"][fn]) {
      return current_ns["if"][fn];
    } else {
      say("Handler missing for " + fn + " @ " + handler_ns);
      return function() {
        return say("Missing handler " + fn + " @ " + handler_ns);
      };
    }
  };

  synthesize_cell = function(node, protocols) {
    var new_cell;
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
    return new_cell;
  };

  parse_ast_node = function(handler, current_node, cell) {
    var current_cell, handler_name, handler_ns, handler_type, handler_value, _ref, _ref2, _ref3, _ref4;
    handler_name = (_ref = handler.method) != null ? _ref.name : void 0;
    handler_type = (_ref2 = handler.method) != null ? _ref2.type : void 0;
    handler_value = (_ref3 = handler.method) != null ? _ref3.value : void 0;
    handler_ns = (_ref4 = handler.ns) != null ? _ref4.name : void 0;
    current_cell = handler_ns === 'this' ? synthesize_cell(current_node, DEFAULT_PROTOCOLS) : cell;
    switch (handler_type) {
      case 'string':
        return function() {
          return handler_value;
        };
      case 'number':
        return function() {
          return handler_value;
        };
      case 'list':
        return function() {
          return handler_value;
        };
      case 'hashmap':
        return function() {
          return handler_value;
        };
      default:
        return dispatch_handler(current_cell, handler_ns, handler_name);
    }
  };

  YUI().use('node', 'event', 'dd', function(Y) {
    var x;
    say('Cells synthesis started');
    if (DEBUG) window.Y = Y;
    x = Y.all("[data-" + DA_EXTEND + "]");
    x.each(function(node) {
      var new_cell, parse_genome, protocols;
      node.generateID();
      protocols = ((node.getData(DA_EXTEND)).split(" ")).filter(function(i) {
        return !!i;
      });
      say("Protocols found for " + node + ": " + protocols);
      new_cell = synthesize_cell(node, protocols);
      parse_genome = (require('genome-parser')).parse;
      return node.all("[data-" + DA_SUBSCRIBE + "]").each(function(s_node) {
        var handlers, subscriptions;
        subscriptions = parse_genome(s_node.getData(DA_SUBSCRIBE));
        say("Subscriptions for " + s_node + ":", subscriptions);
        handlers = subscriptions.handlers.map(function(h) {
          var handler_chain;
          if (Array.isArray(h)) {
            handler_chain = h.map(function(z) {
              return parse_ast_node(z, s_node, new_cell);
            });
            return _.compose.apply(_, handler_chain);
          } else {
            return parse_ast_node(h, s_node, new_cell);
          }
        });
        return subscriptions.events.map(function(e) {
          var event_name, event_ns, _ref, _ref2;
          event_name = (_ref = e.event) != null ? _ref.name : void 0;
          event_ns = (_ref2 = e.ns) != null ? _ref2.name : void 0;
          return handlers.map(function(h) {
            if (event_ns) {
              return new_cell["if"][event_name](h);
            } else {
              return s_node.on(event_name, h);
            }
          });
        });
      });
    });
    say('Cells synthesized for this document:', CELLS);
    return say("Cells synthesis complete.");
  });

}).call(this);
