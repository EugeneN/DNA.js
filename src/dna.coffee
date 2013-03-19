DNA_EXTEND = 'extend'
DNA_SUBSCRIBE = 'subscribe'
DNA_ID_PREFIX = 'Z'
STRING = 'string'
NUMBER = 'number'
VECTOR = 'vector'
HASHMAP = 'hashmap'
NAN = 'NaN'
NULL = 'null'
DNA_DATATYPES = [STRING, NUMBER, VECTOR, HASHMAP, NAN, NULL]
THIS = 'this'
BUILTIN = '*builtin*'

{partial, is_array, is_object, bool, complement, compose3, distinct} = require 'libprotein'

parse_genome = (require 'genome-parser').parse

{
    register_protocol_impl
    dispatch_impl
    get_protocol
    is_async
    get_arity
} = require 'libprotocol'

{
    cont_t, cont_m,
    maybe_t, maybe_m,
    logger_t, logger_m,
    domonad, is_null,
    lift_sync, lift_async
} = require 'libmonad'

{info, warn, error, debug} = dispatch_impl 'ILogger', 'DNA'
devnull = ->

CELLS = {}

get_default_protocols = ->
    (require 'bootstrapper')?.ENV?.DEFAULT_PROTOCOLS or []

process_vector = (vector, cell, dom_parser, cont) =>
    # FIXME
    res = []
    count = vector.length
    local_cont = (idx) ->
        (r) ->
            res[idx] = r
            count--

            if count is 0
                cont res

    vector.map (i, idx) ->
        if i.type in DNA_DATATYPES
            count--
            res[idx] = i.value
        else
            h = (process_ast_handler_node i, cell, dom_parser).impl
            if h.async
                h (local_cont idx)
            else
                ((local_cont idx) h())

default_handlers_cont = (args...) ->
    #debug "DNA monadic sequence finished with results:", args

is_data = (method) -> method.type in DNA_DATATYPES

is_handler = complement is_data

lift = (h) ->
    if h.meta.async
        lift_async h.meta.arity, h
    else
        lift_sync h.meta.arity, h

get_method_ns = (name, cell) ->
    method_invariants = cell.receptors[name]

    if method_invariants?.length > 0
        method_invariants[0].ns

    else
        error "No such method: #{name} in the cell:", cell
        throw "Method missing in cell"

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
            error "Handler missing", {ns, name, cell}
            throw "Handler missing"
    else
        error "Handler missing", {ns, name, cell}
        throw "Handler missing"

synthesize_cell = (node, protocols, dom_parser) ->
    unless node.id
        # id must start with a word char (or the grammar has to be updated)
        node.id = (dom_parser.get_id node) or DNA_ID_PREFIX + Math.uuid().replace(/-/g, '_')

    proto_cell =
        id: node.id
        node: node
        receptors: {}
        impls: {}

    # Protocols must be unique. This must be validated at the registration step.
    all_the_protocols = distinct (protocols.concat get_default_protocols())

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

find_cell = (scope_id, this_cell, dom_parser) ->
    if (scope_id is THIS or not scope_id) and this_cell
        this_cell
    else if cell = get_cell scope_id
        cell
    else if cell = get_create_cell_by_id scope_id, dom_parser
        cell
    else
        null

get_create_cell = (id, node, dom_parser) ->
    if cell = get_cell id
        cell
    else
        cell = synthesize_cell node, get_default_protocols(), dom_parser
        save_cell cell
        cell

get_create_cell_by_id = (id, dom_parser) ->
    if node = dom_parser.get_by_id id
        get_create_cell id, node, dom_parser
    else
        null

dispatch_handler_fn = (ns, method, cell, dom_parser) ->
    # FIXME
    switch method.type
        when STRING
            impl = -> method.value
            impl.meta = {arity: 0, async: false, ns: BUILTIN, name: "String '#{method.value}'"}
            {impl}

        when NUMBER
            impl = -> method.value
            impl.meta = {arity: 0, async: false, ns: BUILTIN, name: "Number '#{method.value}'"}
            {impl}

        when VECTOR
            impl = (cont) ->
                process_vector method.value, cell, dom_parser, (res) ->
                    cont res
            impl.meta = {async: true, arity: 1, protocol: BUILTIN, name: "Vector"}
            {impl}

        when HASHMAP
            impl = (key) -> if key then method.value[key] else method.value
            impl.meta = {arity: 1, async: false, protocol: BUILTIN, name: "Hashmap"}
            {impl}

        when NAN
            impl = -> NaN
            impl.meta = {arity: 0, async: false, protocol: BUILTIN, name: "NaN"}
            {impl}

        when NULL
            impl = -> null
            impl.meta = {arity: 0, async: false, protocol: BUILTIN, name: "null"}
            {impl}

        else dispatch_handler ns?.name, method.name, cell

dna_to_host_value = (ast_node) ->
    proto_val = ast_node.method or ast_node

    if proto_val.type
        switch proto_val.type
            when VECTOR
                proto_val.value.map (i) -> dna_to_host_value i
            when HASHMAP
                throw "Not implemented" # TODO
            else
                proto_val.value

    else
        debug "Unexpected datatype received", ast_node
        throw "Unexpected datatype received"

process_ast_handler_node = (handler, current_cell, dom_parser) ->
    {ns, method, scope} = if is_array handler then handler[0] else handler

    cell_id = scope?.name or THIS
    cell = find_cell cell_id, current_cell, dom_parser

    handler_ns = if is_handler method
        ns?.name or (get_method_ns method.name, cell)
    else
        ns?.name

    unless cell
        error "Unknown cell referenced in handler", cell_id, handler
        throw "Unknown cell referenced in handler"

    handler_fn = (dispatch_handler_fn ns, method, cell, dom_parser).impl

    real_handler = if is_array handler
        partial handler_fn, (handler[1...].map dna_to_host_value)...
    else
        handler_fn

    {impl: real_handler}

make_extended_node = (dom_parser, node) ->
    protocols = ((dom_parser.getData DNA_EXTEND, node).split " ").filter (i) -> !!i
    #debug "Protocols found for", node, ":", protocols

    save_cell (synthesize_cell node, protocols, dom_parser)

process_meta = (cell, h) ->
    # TODO
    h

make_monadized_handler = (dom_parser, cell, handlr) ->
    handlers_ast_list = if is_array handlr then handlr else [handlr]
    ast_parser = (h) -> (process_ast_handler_node h, cell, dom_parser).impl
    do_meta = partial process_meta, cell
    lifted_handlers_chain = handlers_ast_list.map (compose3 lift, do_meta, ast_parser)
    wrapper_monad = cont_t (logger_t (maybe_m {is_error: is_null}), devnull)

    (init_val) ->
        #debug "Starting DNA monadic sequence with arguments:", init_val
        (domonad wrapper_monad, lifted_handlers_chain, init_val) default_handlers_cont

interpose_handlers_with_events = (dom_parser, cell, handlers, evs_args) ->
    [{ns, event, scope}, raw_args...] = if is_array evs_args then evs_args else [evs_args, []]
    args = (raw_args.filter (a) -> a.event.type in DNA_DATATYPES).map (a) -> a.event.value

    handlers.map (handlr) ->
        # TBD delegate this later
        (dispatch_handler ns?.name,
                          event.name,
                          (find_cell (scope?.name or THIS),
                                     cell,
                                     dom_parser)).impl (args.concat [handlr])...

make_subscribed_node = (dom_parser, node) ->
    cell = get_create_cell node.id, node, dom_parser

    dna_sequences = parse_genome (dom_parser.getData DNA_SUBSCRIBE, cell.node)
    #debug "DNA AST for", cell, ":", dna_sequences

    dna_sequences.map (dna_seq) ->
        dna_seq.events.map (partial interpose_handlers_with_events,
                                    dom_parser,
                                    cell,
                                    (dna_seq.handlers.map (partial make_monadized_handler,
                                                                   dom_parser,
                                                                   cell)))

synthesize_node = (dom_parser) ->
    START_TIME = new Date

    root_node = dom_parser.get_root_node()
    #debug 'Cells synthesis started for node', root_node

    extended_nodes = dom_parser.get_by_attr "[data-#{DNA_EXTEND}]"
    subscribed_nodes = dom_parser.get_by_attr "[data-#{DNA_SUBSCRIBE}]"

    extended_nodes.map (partial make_extended_node, dom_parser)
    subscribed_nodes.map (partial make_subscribed_node, dom_parser)

    #debug "Cells synthesis completed in #{new Date - START_TIME}ms."

module.exports =
# Entry point
    start_synthesis: ({root_node}={}) ->
        info 'Synthesis started'
        root_idom = dispatch_impl 'IDom', root_node

        # TODO use MutationObserver instead when applicable
        root_idom.add_event_listener "DOMNodeInserted", (event) ->
            setTimeout(
                -> synthesize_node (dispatch_impl 'IDom', event.target)
                10
            )

        synthesize_node root_idom

    dump_cells: ->
        info 'Cells synthesized for this document:', CELLS
