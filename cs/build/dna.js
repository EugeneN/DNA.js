
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"IDom": function(exports, require, module) {(function() {
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
          say('IDom impl', node, args);
          return node.setContent(args);
        },
        alert: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return alert.apply(null, args);
        }
      };
    })(node);
  });

}).call(this);
}, "IDraggable": function(exports, require, module) {(function() {
  var register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  register_protocol_impl('IDraggable', function(node) {
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
  });

  register_protocol_impl('IPositionReporter', function(node) {
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
  });

}).call(this);
}, "dna": function(exports, require, module) {(function() {
  var CELLS, DA_EXTEND, DA_SUBSCRIBE, DEBUG, DEFAULT_PROTOCOLS, THIS, dispatch_handler, dispatch_impl, ep, get_cell, get_cell_or_this, get_create_cell, get_protocol, parse_ast_node, parse_genome, register_protocol_impl, save_cell, say, synthesize_cell, _ref, _ref2;
  var __slice = Array.prototype.slice;

  DEBUG = true;

  DA_EXTEND = 'extend-with';

  DA_SUBSCRIBE = 'subscribe';

  THIS = 'this';

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  parse_genome = (require('genome-parser')).parse;

  _ref = require('libprotocol'), register_protocol_impl = _ref.register_protocol_impl, dispatch_impl = _ref.dispatch_impl, dispatch_handler = _ref.dispatch_handler;

  _ref2 = require('protocols'), DEFAULT_PROTOCOLS = _ref2.DEFAULT_PROTOCOLS, get_protocol = _ref2.get_protocol;

  CELLS = {};

  synthesize_cell = function(node, protocols) {
    var all_the_protocols, proto_cell;
    node.id || (node.id = Y.guid());
    proto_cell = {
      id: node.id,
      receptors: {}
    };
    all_the_protocols = _.uniq(DEFAULT_PROTOCOLS.concat(protocols));
    all_the_protocols.map(function(protocol) {
      var impl_inst, p;
      p = get_protocol(protocol);
      impl_inst = dispatch_impl(protocol, node);
      if (p && impl_inst) {
        return p.map(function(_arg) {
          var args, method;
          method = _arg[0], args = _arg[1];
          return proto_cell.receptors[method] = impl_inst[method];
        });
      }
    });
    return proto_cell;
  };

  save_cell = function(cell) {
    return CELLS[cell.id] = cell;
  };

  get_cell = function(id) {
    return CELLS[id];
  };

  get_cell_or_this = function(node, ns) {
    var a_node, cell;
    if (ns === THIS) {
      return get_create_cell(node);
    } else if (cell = get_cell(ns)) {
      return cell;
    } else if (a_node = Y.one("#" + ns)) {
      return get_create_cell(a_node);
    } else {
      return null;
    }
  };

  get_create_cell = function(node) {
    var cell;
    if (cell = get_cell(node.id)) {
      return cell;
    } else {
      cell = synthesize_cell(node, DEFAULT_PROTOCOLS);
      save_cell(cell);
      return cell;
    }
  };

  parse_ast_node = function(handler, current_node) {
    var current_cell, handler_name, handler_ns, handler_type, handler_value, _ref3, _ref4, _ref5, _ref6;
    handler_name = (_ref3 = handler.method) != null ? _ref3.name : void 0;
    handler_type = (_ref4 = handler.method) != null ? _ref4.type : void 0;
    handler_value = (_ref5 = handler.method) != null ? _ref5.value : void 0;
    handler_ns = (_ref6 = handler.ns) != null ? _ref6.name : void 0;
    current_cell = handler_ns === THIS ? get_create_cell(current_node) : get_create_cell(current_node.ancestor("[data-" + DA_EXTEND + "]"));
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

  ep = function(Y) {
    var cell_matrices, gene_expression_matrices;
    say('Cells synthesis started');
    if (DEBUG) window.Y = Y;
    cell_matrices = Y.all("[data-" + DA_EXTEND + "]");
    gene_expression_matrices = Y.all("[data-" + DA_SUBSCRIBE + "]");
    cell_matrices.each(function(node) {
      var cell, protocols;
      protocols = ((node.getData(DA_EXTEND)).split(" ")).filter(function(i) {
        return !!i;
      });
      say("Protocols found for", node, ":", protocols);
      cell = synthesize_cell(node, protocols);
      return save_cell(cell);
    });
    gene_expression_matrices.each(function(node) {
      var handlers, subscriptions;
      subscriptions = parse_genome(node.getData(DA_SUBSCRIBE));
      say("Subscriptions for", node, ":", subscriptions);
      handlers = subscriptions.handlers.map(function(h) {
        var handler_chain;
        if (Array.isArray(h)) {
          handler_chain = h.map(function(z) {
            return parse_ast_node(z, node);
          });
          return _.compose.apply(_, handler_chain);
        } else {
          return parse_ast_node(h, node);
        }
      });
      return subscriptions.events.map(function(e) {
        var event_name, event_ns, _ref3, _ref4;
        event_name = (_ref3 = e.event) != null ? _ref3.name : void 0;
        event_ns = (_ref4 = e.ns) != null ? _ref4.name : void 0;
        return handlers.map(function(h) {
          var cell;
          if (event_ns) {
            cell = get_cell_or_this(node, event_ns);
            return cell.receptors[event_name](h);
          } else {
            return node.on(event_name, h);
          }
        });
      });
    });
    return say("Cells synthesis complete.");
  };

  module.exports = {
    start_synthesis: function() {
      return YUI().use('node', 'event', 'dd', ep);
    },
    dump_cells: function() {
      return say('Cells synthesized for this document:', CELLS);
    }
  };

}).call(this);
}, "libprotocol": function(exports, require, module) {(function() {
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
}, "protocols": function(exports, require, module) {(function() {
  var DEFAULT_PROTOCOLS, Protocols, get_protocol;

  Protocols = {
    IDraggable: [['setX', ['x']], ['setY', ['y']], ['setXY', ['x', 'y']], ['onDragStart', ['f']], ['onDragStop', ['f']]],
    IPositionReporter: [['getX', []], ['getY', []], ['getXY', []]],
    IDom: [['setContent', ['new_content']], ['alert', ['m']]]
  };

  DEFAULT_PROTOCOLS = ['IDom'];

  get_protocol = function(p) {
    return Protocols[p];
  };

  module.exports = {
    Protocols: Protocols,
    DEFAULT_PROTOCOLS: DEFAULT_PROTOCOLS,
    get_protocol: get_protocol
  };

}).call(this);
}});
