(function() {
  var CELLS, DA_EXTEND, DA_SUBSCRIBE, DEBUG, DEFAULT_PROTOCOLS, THIS, dispatch_handler, dispatch_impl, ep, get_cell, get_cell_or_this, get_create_cell, get_protocol, parse_ast_handler_node, parse_genome, register_protocol_impl, save_cell, say, synthesize_cell, _ref, _ref2;
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

  get_cell_or_this = function(node, scope_id) {
    var a_node, cell;
    say('>>>', node, scope_id);
    if (scope_id === THIS) {
      return get_create_cell(node.id, node);
    } else if (cell = get_cell(scope_id)) {
      return cell;
    } else if (a_node = Y.one("#" + scope_id)) {
      return get_create_cell(a_node.id, a_node);
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

  parse_ast_handler_node = function(handler, current_cell) {
    var cell, method, ns, scope, x;
    ns = handler.ns, method = handler.method, scope = handler.scope;
    cell = (function() {
      if (!scope || scope.name === THIS) {
        return current_cell;
      } else if (x = get_cell(scope.name)) {
        return x;
      } else {
        say("Unknown cell referenced in handler", handler);
        throw "Unknown cell referenced in handler";
      }
    })();
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
      var cell, handlers, subscriptions;
      cell = get_create_cell(node.id, node);
      subscriptions = parse_genome(cell.node.getData(DA_SUBSCRIBE));
      say("Subscriptions for", cell, ":", subscriptions);
      handlers = subscriptions.handlers.map(function(handlr) {
        var handler_chain;
        if (Array.isArray(handlr)) {
          handler_chain = handlr.map(function(x) {
            return (parse_ast_handler_node(x, cell)).impl;
          });
          return _.compose.apply(_, handler_chain.reverse());
        } else {
          return parse_ast_handler_node(handlr, cell);
        }
      });
      return subscriptions.events.map(function(_arg) {
        var event, ns, scope;
        ns = _arg.ns, event = _arg.event, scope = _arg.scope;
        return handlers.map(function(handlr) {
          var event_scope_cell, h;
          event_scope_cell = get_cell_or_this(cell, scope.name);
          if (scope) {
            h = dispatch_handler(ns != null ? ns.name : void 0, event.name, event_scope_cell);
            return h.impl(handlr);
          } else {
            return event_scope_cell.node.on(event.name, handlr);
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
