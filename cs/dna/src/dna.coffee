DEBUG = true

DA_EXTEND = 'extend-with'
DA_SUBSCRIBE = 'subscribe'
THIS = 'this'

say = (a...) -> console.log.apply console, a

parse_genome = (require 'genome-parser').parse

{register_protocol_impl, dispatch_impl,
 dispatch_handler} = require 'libprotocol'

{DEFAULT_PROTOCOLS, get_protocol} = require 'protocols'

CELLS = {}


synthesize_cell = (node, protocols) ->
    node.id or= Y.guid()

    proto_cell =
        id: node.id
        receptors: {}

    all_the_protocols = _.uniq (DEFAULT_PROTOCOLS.concat protocols)

    all_the_protocols.map (protocol) ->
        p = get_protocol protocol
        impl_inst = dispatch_impl protocol, node

        if p and impl_inst
            p.map ([method, args]) ->
                proto_cell.receptors[method] = impl_inst[method]

    proto_cell

save_cell = (cell) -> CELLS[cell.id] = cell

get_cell = (id) -> CELLS[id]

get_cell_or_this = (node, ns) ->
    if ns is THIS
        get_create_cell node
    else if cell = get_cell ns
        cell
    else if a_node = Y.one "##{ns}"
        get_create_cell a_node
    else
        null


get_create_cell = (node) ->
    if cell = get_cell node.id
        cell
    else
        cell = synthesize_cell node, DEFAULT_PROTOCOLS
        save_cell cell
        cell

parse_ast_node = (handler, current_node) ->
    handler_name = handler.method?.name
    handler_type = handler.method?.type
    handler_value = handler.method?.value

    handler_ns = handler.ns?.name

    current_cell = if handler_ns is THIS
        get_create_cell current_node

    else
        get_create_cell (current_node.ancestor "[data-#{DA_EXTEND}]")

    switch handler_type
        when 'string'    then -> handler_value
        when 'number'    then -> handler_value
        when 'list'      then -> handler_value
        when 'hashmap'   then -> handler_value

        else dispatch_handler current_cell, handler_ns, handler_name


# Entry point
ep = (Y) ->
    say 'Cells synthesis started'

    window.Y = Y if DEBUG

    cell_matrices = Y.all "[data-#{DA_EXTEND}]"
    gene_expression_matrices = Y.all "[data-#{DA_SUBSCRIBE}]"

    cell_matrices.each (node) ->
        protocols = ((node.getData DA_EXTEND).split " ").filter (i) -> !!i
        say "Protocols found for", node, ":", protocols

        cell = synthesize_cell node, protocols
        save_cell cell


    gene_expression_matrices.each (node) ->
        subscriptions = parse_genome (node.getData DA_SUBSCRIBE)
        say "Subscriptions for", node, ":", subscriptions

        handlers = subscriptions.handlers.map (h) ->
            if Array.isArray h
                handler_chain = h.map (z) -> parse_ast_node z, node
                _.compose(handler_chain...)
            else
                parse_ast_node h, node

        subscriptions.events.map (e) ->
            event_name = e.event?.name
            event_ns = e.ns?.name

            handlers.map (h) ->
                # delegate this later
                if event_ns
                    cell = get_cell_or_this node, event_ns
                    cell.receptors[event_name] h
                else
                    node.on event_name, h



    say "Cells synthesis complete."

module.exports =
    start_synthesis: ->
        YUI().use 'node', 'event', 'dd', ep

    dump_cells: ->
        say 'Cells synthesized for this document:', CELLS


