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

find_cell = (scope_id, this_cell) ->
    if (scope_id is THIS or not scope_id) and this_cell
        this_cell
    else if cell = get_cell scope_id
        cell
    else if cell = get_create_cell_by_id scope_id
        cell
    else
        null

get_create_cell = (id, node) ->
    if cell = get_cell id
        cell
    else
        cell = synthesize_cell node, DEFAULT_PROTOCOLS
        save_cell cell
        cell

get_create_cell_by_id = (id) ->
    if node = Y.one "##{id}"
        get_create_cell id, node
    else
        null

parse_ast_handler_node = (handler, current_cell) ->
    {ns, method, scope} = handler

    cell_id = scope?.name or THIS
    cell = find_cell cell_id, current_cell

    unless cell
        say "Unknown cell referenced in handler", handler
        throw "Unknown cell referenced in handler"

    switch method.type
        when 'string'
            impl: -> method.value
        when 'number'
            impl: -> method.value
        when 'vector'      
            impl: (idx, lastidx) -> 
                if idx and not isNaN idx
                    method.value[idx].value
                else if idx and lastidx and not (isNaN idx) and not (isNaN lastidx)
                    (i.value for i in method.value[idx...lastidx])
                else
                    (i.value for i in method.value)
        when 'hashmap'
            impl: (key) -> 
                if key
                    method.value[key]
                else
                    method.value

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

        dna_sequences = parse_genome (cell.node.getData DA_SUBSCRIBE)
        say "DNA AST for", cell, ":", dna_sequences

        dna_sequences.map (dna_seq) ->
            handlers = dna_seq.handlers.map (handlr) ->
                handlers_ast_list = if Array.isArray handlr then handlr else [handlr]
                ast_parser = (h) ->
                    m = parse_ast_handler_node h, cell
                    m.impl

                handler_chain = handlers_ast_list.map ast_parser

                # XXX underscore's compose composes in reverse order for some reason
                _.compose(handler_chain.reverse()...)

            dna_seq.events.map ({ns, event, scope}) ->
                handlers.map (handlr) ->
                    # TBD delegate this later
                    event_scope_cell = find_cell (scope?.name or THIS), cell

                    h = dispatch_handler ns?.name, event.name, event_scope_cell
                    h.impl handlr

    say "Cells synthesis completed in #{new Date - START}ms."

module.exports =
    start_synthesis: ->
        YUI().use 'dom', 'node', 'event', 'dd', 'calendar', ep

    dump_cells: ->
        say 'Cells synthesized for this document:', CELLS


