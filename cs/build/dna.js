
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
}).call(this)({"ICalendar": function(exports, require, module) {(function() {
  var register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  register_protocol_impl('ICalendar', function(node) {
    return (function(node) {
      var cal, cont;
      cont = Y.Node.create('<span>');
      node.insert(cont, 'after');
      cal = new Y.Calendar({
        contentBox: cont,
        width: '340px'
      });
      cal.render().hide();
      return {
        show: function() {
          cal.show();
          return cal.visible = true;
        },
        hide: function() {
          cal.hide();
          return cal.visible = false;
        },
        toggle: function() {
          if (cal.visible) {
            cal.hide();
            return cal.visible = false;
          } else {
            cal.show();
            return cal.visible = true;
          }
        },
        setDate: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return alert('not implemented yet');
        },
        onSelectionChange: function(f) {
          return cal.on('selectionChange', function(ev) {
            return f(ev.newSelection[0]);
          });
        },
        getContainer: function() {
          return cont;
        }
      };
    })(node);
  });

}).call(this);
}, "IDom": function(exports, require, module) {(function() {
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
        setValue: function(v) {
          return node.set('value', v);
        },
        setAttr: function(attr) {
          say('setattr');
          return node.setAttribute(attr);
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
          say('kill');
          return node.remove();
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
          return node.setX(x + 10);
        },
        setY: function(y) {
          return node.setY(y + 10);
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

  register_protocol_impl('IMovable', function(node) {
    return (function(node) {
      return {
        moveUp: function(x) {
          return node.setY(node.getY() - parseInt(x));
        },
        moveDown: function(x) {
          return node.setY(node.getY() + parseInt(x));
        },
        moveLeft: function(x) {
          return node.setX(node.getX() - parseInt(x));
        },
        moveRight: function(x) {
          return node.setX(node.getX() + parseInt(x));
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
  var CELLS, DA_EXTEND, DA_SUBSCRIBE, DEBUG, DEFAULT_PROTOCOLS, THIS, dispatch_handler, dispatch_impl, ep, find_cell, get_cell, get_create_cell, get_create_cell_by_id, get_protocol, parse_ast_handler_node, parse_genome, register_protocol_impl, save_cell, say, synthesize_cell, _ref, _ref2;
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

  _ref = require('libprotocol'), register_protocol_impl = _ref.register_protocol_impl, dispatch_impl = _ref.dispatch_impl;

  _ref2 = require('protocols'), DEFAULT_PROTOCOLS = _ref2.DEFAULT_PROTOCOLS, get_protocol = _ref2.get_protocol;

  CELLS = {};

  dispatch_handler = function(ns, name, cell) {
    var handler, method_invariants;
    method_invariants = cell.receptors[name];
    if (method_invariants) {
      if (method_invariants.length === 1 && !ns) {
        handler = method_invariants[0];
      } else {
        handler = (cell.receptors[name].filter(function(m) {
          return m.ns === ns;
        }))[0];
      }
      if (handler) {
        return handler;
      } else {
        say("Handler missing", {
          ns: ns,
          name: name,
          cell: cell
        });
        throw "Handler missing";
      }
    } else {
      say("Handler missing", {
        ns: ns,
        name: name,
        cell: cell
      });
      throw "Handler missing";
    }
  };

  synthesize_cell = function(node, protocols) {
    var all_the_protocols, proto_cell;
    node.id || (node.id = node.get('id') || Y.guid());
    proto_cell = {
      id: node.id,
      node: node,
      receptors: {},
      impls: {}
    };
    all_the_protocols = _.uniq(DEFAULT_PROTOCOLS.concat(protocols));
    all_the_protocols.map(function(protocol) {
      var p;
      p = get_protocol(protocol);
      proto_cell.impls[protocol] = dispatch_impl(protocol, node);
      if (p && proto_cell.impls[protocol]) {
        return p.map(function(_arg) {
          var args, m, method;
          method = _arg[0], args = _arg[1];
          m = {
            name: method,
            ns: protocol,
            impl: proto_cell.impls[protocol][method]
          };
          if (proto_cell.receptors[method]) {
            return proto_cell.receptors[method].push(m);
          } else {
            return proto_cell.receptors[method] = [m];
          }
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

  find_cell = function(scope_id, this_cell) {
    var cell;
    if ((scope_id === THIS || !scope_id) && this_cell) {
      return this_cell;
    } else if (cell = get_cell(scope_id)) {
      return cell;
    } else if (cell = get_create_cell_by_id(scope_id)) {
      return cell;
    } else {
      return null;
    }
  };

  get_create_cell = function(id, node) {
    var cell;
    if (cell = get_cell(id)) {
      return cell;
    } else {
      cell = synthesize_cell(node, DEFAULT_PROTOCOLS);
      save_cell(cell);
      return cell;
    }
  };

  get_create_cell_by_id = function(id) {
    var node;
    if (node = Y.one("#" + id)) {
      return get_create_cell(id, node);
    } else {
      return null;
    }
  };

  parse_ast_handler_node = function(handler, current_cell) {
    var cell, cell_id, method, ns, scope;
    ns = handler.ns, method = handler.method, scope = handler.scope;
    cell_id = (scope != null ? scope.name : void 0) || THIS;
    cell = find_cell(cell_id, current_cell);
    if (!cell) {
      say("Unknown cell referenced in handler", handler);
      throw "Unknown cell referenced in handler";
    }
    switch (method.type) {
      case 'string':
        return {
          impl: function() {
            return method.value;
          }
        };
      case 'number':
        return {
          impl: function() {
            return method.value;
          }
        };
      case 'list':
        return {
          impl: function() {
            return method.value;
          }
        };
      case 'hashmap':
        return {
          impl: function() {
            return method.value;
          }
        };
      default:
        return dispatch_handler(ns != null ? ns.name : void 0, method.name, cell);
    }
  };

  ep = function(Y) {
    var START, cell_matrices, gene_expression_matrices;
    say('Cells synthesis started');
    START = new Date;
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
      var cell, dna_sequences;
      cell = get_create_cell(node.id, node);
      dna_sequences = parse_genome(cell.node.getData(DA_SUBSCRIBE));
      say("DNA AST for", cell, ":", dna_sequences);
      return dna_sequences.map(function(dna_seq) {
        var handlers;
        handlers = dna_seq.handlers.map(function(handlr) {
          var ast_parser, handler_chain, handlers_ast_list;
          handlers_ast_list = Array.isArray(handlr) ? handlr : [handlr];
          ast_parser = function(h) {
            var m;
            m = parse_ast_handler_node(h, cell);
            return m.impl;
          };
          handler_chain = handlers_ast_list.map(ast_parser);
          return _.compose.apply(_, handler_chain.reverse());
        });
        return dna_seq.events.map(function(_arg) {
          var event, ns, scope;
          ns = _arg.ns, event = _arg.event, scope = _arg.scope;
          return handlers.map(function(handlr) {
            var event_scope_cell, h;
            event_scope_cell = find_cell((scope != null ? scope.name : void 0) || THIS, cell);
            h = dispatch_handler(ns != null ? ns.name : void 0, event.name, event_scope_cell);
            return h.impl(handlr);
          });
        });
      });
    });
    return say("Cells synthesis completed in " + (new Date - START) + "ms.");
  };

  module.exports = {
    start_synthesis: function() {
      return YUI().use('dom', 'node', 'event', 'dd', 'calendar', ep);
    },
    dump_cells: function() {
      return say('Cells synthesized for this document:', CELLS);
    }
  };

}).call(this);
}, "libprotocol": function(exports, require, module) {(function() {
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
}, "protocols": function(exports, require, module) {(function() {
  var DEFAULT_PROTOCOLS, Protocols, get_protocol;

  Protocols = {
    IDraggable: [['setX', ['x']], ['setY', ['y']], ['setXY', ['x', 'y']], ['onDragStart', ['f']], ['onDragStop', ['f']]],
    IMovable: [['moveUp', ['x']], ['moveDown', ['x']], ['moveLeft', ['x']], ['moveRight', ['x']]],
    IPositionReporter: [['getX', []], ['getY', []], ['getXY', []]],
    IDom: [['setContent', ['new_content']], ['setValue', ['new_value']], ['alert', ['msg']], ['click', ['handler']], ['say', ['msgs']], ['appendContent', ['content']], ['kill', []], ['setAttr', ['attr']]],
    ICalendar: [['show', []], ['hide', []], ['toggle', []], ['setDate', ['date']], ['onSelectionChange', ['f']]]
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
