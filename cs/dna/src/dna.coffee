DEBUG = true

DA_EXTEND = 'extend-with'
DA_SUBSCRIBE = 'subscribe'
THIS = 'this'

say = (a...) -> console.log.apply console, a

parse_genome = (require 'genome-parser').parse

{register_protocol_impl, dispatch_impl} = require 'libprotocol'

{DEFAULT_PROTOCOLS, get_protocol} = require 'protocols'

CELLS = {}


dispatch_handler = (ns, name, cell) ->
    method_invariants = cell.receptors[name]

    if method_invariants
        if method_invariants.length is 1 and not ns
            handler =  method_invariants[0]
        else
            handler = (cell.receptors[name].filter (m) -> m.ns is ns)[0]

        if handler
            handler
        else
            say "Handler missing", {ns, name, cell}
            throw "Handler missing"
    else
        say "Handler missing", {ns, name, cell}
        throw "Handler missing"

synthesize_cell = (node, protocols) ->
    node.id or= (node.get('id') or Y.guid())

    proto_cell =
        id: node.id
        node: node
        receptors: {}
        impls: {}

    all_the_protocols = _.uniq (DEFAULT_PROTOCOLS.concat protocols)

    all_the_protocols.map (protocol) ->
        p = get_protocol protocol
        proto_cell.impls[protocol] = dispatch_impl protocol, node

        if p and proto_cell.impls[protocol]
            p.map ([method, args]) ->
                m =
                    name: method
                    ns: protocol
                    impl: proto_cell.impls[protocol][method]

                if proto_cell.receptors[method]
                    proto_cell.receptors[method].push m
                else
                    proto_cell.receptors[method] = [m]

    proto_cell

save_cell = (cell) -> CELLS[cell.id] = cell

get_cell = (id) -> CELLS[id]

get_cell_or_this = (node, scope_id) ->
    if scope_id is THIS
        get_create_cell node.id, node
    else if cell = get_cell scope_id
        cell
    else if a_node = Y.one "##{scope_id}"
        get_create_cell a_node.id, a_node
    else
        null


get_create_cell = (id, node) ->
    if cell = get_cell id
        cell
    else
        cell = synthesize_cell node, DEFAULT_PROTOCOLS
        save_cell cell
        cell


parse_ast_handler_node = (handler, current_cell) ->
    {ns, method, scope} = handler

    cell = if not scope or scope.name is THIS
        current_cell
    else if x = get_cell scope.name
        x
    else
        say "Unknown cell referenced in handler", handler
        throw "Unknown cell referenced in handler"

    switch method.type
        when 'string'    then {impl: -> method.value}
        when 'number'    then {impl: -> method.value}
        when 'list'      then {impl: -> method.value}
        when 'hashmap'   then {impl: -> method.value}

        else dispatch_handler ns?.name, method.name, cell


# Entry point
ep = (Y) ->
    say 'Cells synthesis started'
    START = new Date

    window.Y = Y if DEBUG

    cell_matrices = Y.all "[data-#{DA_EXTEND}]"
    gene_expression_matrices = Y.all "[data-#{DA_SUBSCRIBE}]"

    cell_matrices.each (node) ->
        protocols = ((node.getData DA_EXTEND).split " ").filter (i) -> !!i
        say "Protocols found for", node, ":", protocols

        cell = synthesize_cell node, protocols
        save_cell cell

    gene_expression_matrices.each (node) ->
        cell = get_create_cell node.id, node

        subscriptions = parse_genome (cell.node.getData DA_SUBSCRIBE)
        say "Subscriptions for", cell, ":", subscriptions

        handlers = subscriptions.handlers.map (handlr) ->
            if Array.isArray handlr
                handler_chain = handlr.map (x) -> (parse_ast_handler_node x, cell).impl
                _.compose(handler_chain.reverse()...)
            else
                parse_ast_handler_node handlr, cell

        subscriptions.events.map ({ns, event, scope}) ->
            handlers.map (handlr) ->
                # delegate this later
                event_scope_cell = get_cell_or_this cell, scope.name

                if scope
                    h = dispatch_handler ns?.name, event.name, event_scope_cell
                    h.impl handlr
                else
                    # make this use protocols too
                    event_scope_cell.node.on event.name, handlr



    say "Cells synthesis completed in #{new Date - START}ms."

module.exports =
    start_synthesis: ->
        YUI().use 'node', 'event', 'dd', ep

    dump_cells: ->
        say 'Cells synthesized for this document:', CELLS


