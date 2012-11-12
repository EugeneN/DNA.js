(function() {
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
    var cell, cell_id, handler_fn, method, ns, partial_args, partially_applied_handler, scope, _ref3;
    if (Array.isArray(handler)) {
      _ref3 = handler[0], ns = _ref3.ns, method = _ref3.method, scope = _ref3.scope;
    } else {
      ns = handler.ns, method = handler.method, scope = handler.scope;
    }
    cell_id = (scope != null ? scope.name : void 0) || THIS;
    cell = find_cell(cell_id, current_cell);
    if (!cell) {
      say("Unknown cell referenced in handler", cell_id, handler);
      throw "Unknown cell referenced in handler";
    }
    handler_fn = (function() {
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
        case 'vector':
          return {
            impl: function(idx, lastidx) {
              var i, _i, _j, _len, _len2, _ref4, _ref5, _results, _results2;
              if (idx && !isNaN(idx)) {
                return method.value[idx].value;
              } else if (idx && lastidx && !(isNaN(idx)) && !(isNaN(lastidx))) {
                _ref4 = method.value.slice(idx, lastidx);
                _results = [];
                for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
                  i = _ref4[_i];
                  _results.push(i.value);
                }
                return _results;
              } else {
                _ref5 = method.value;
                _results2 = [];
                for (_j = 0, _len2 = _ref5.length; _j < _len2; _j++) {
                  i = _ref5[_j];
                  _results2.push(i.value);
                }
                return _results2;
              }
            }
          };
        case 'hashmap':
          return {
            impl: function(key) {
              if (key) {
                return method.value[key];
              } else {
                return method.value;
              }
            }
          };
        default:
          return dispatch_handler(ns != null ? ns.name : void 0, method.name, cell);
      }
    })();
    if (Array.isArray(handler)) {
      partial_args = handler.slice(1).map(function(i) {
        return i.value;
      });
      partially_applied_handler = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        say('going to partially apply ', partial_args, args, handler_fn);
        return handler_fn.impl.apply(null, partial_args.concat(args))();
      };
      say('>>>>>', partially_applied_handler, partial_args);
      return {
        impl: partially_applied_handler
      };
    } else {
      return handler_fn;
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
