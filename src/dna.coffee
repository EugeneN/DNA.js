DNA_EXTEND = 'extend'
DNA_SUBSCRIBE = 'subscribe'
DNA_ID_PREFIX = 'Z'

NAN =       'NaN'
NULL =      'null'
KEYWORD =   'keyword'
STRING =    'string'
INTEGER =   'integer'
FLOAT =     'float'
VECTOR =    'vector'
HASHMAP =   'hashmap'

FUNCTION =  'fn'
PARTIAL_FN = 'partial'
NESTED_EXPR = 'nested'
QUOTED_NESTED_EXPR = 'quoted-nested'

DNA_PRIMITIVES = [NAN, NULL, KEYWORD, STRING, INTEGER, FLOAT]
DNA_DATATYPES = [NAN, NULL, KEYWORD, STRING, INTEGER, FLOAT, VECTOR, HASHMAP]
THIS = 'this'
BUILTIN = '*builtin*'

Math = require '../utils/Math.uuid'

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

process_vector = (vector, cell, dom_parser, cont) ->
    # FIXME paralellize with arrows
    res = []
    count = vector.length
    local_cont = (idx) ->
        (r) ->
            res[idx] = r
            count--

            if count is 0
                cont res

    vector.map (ast_node, idx) ->
        h = process_ast_handler_node cell, dom_parser, ast_node
        if h.meta.async
            h (local_cont idx)
        else
            ((local_cont idx) h())

default_handlers_cont = (args...) ->
    #debug "DNA monadic sequence finished with results:", args

is_value = (type) -> type in DNA_DATATYPES

is_function = (type) -> type in [FUNCTION, PARTIAL_FN]

is_just_function = (type) -> type is FUNCTION

is_partial_function = (type) -> type is PARTIAL_FN

is_nested_expr = (type) -> type is NESTED_EXPR

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
        handler = if method_invariants.length is 1 and not ns
            method_invariants[0]
        else
            (cell.receptors[name].filter (m) -> m.ns is ns)[0]

        if handler
            handler.impl
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
            p.map ([name, args]) ->
                m =
                    name: name
                    ns: protocol
                    impl: proto_cell.impls[protocol][name]

                if proto_cell.receptors[name]
                    proto_cell.receptors[name].push m
                else
                    proto_cell.receptors[name] = [m]

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

fun_with_meta = (fn, meta) ->
    fn.meta = meta
    fn

get_primitive_value_handler = (type, value) ->
    switch type
        when NAN
            fun_with_meta (-> NaN), {arity: 0, async: false, protocol: BUILTIN, name: "NaN"}
        when NULL
            fun_with_meta (-> null), {arity: 0, async: false, protocol: BUILTIN, name: "null"}
        when KEYWORD
            fun_with_meta (-> value), {arity: 0, async: false, protocol: BUILTIN, name: "Keyword #{value}"}
        when STRING
            fun_with_meta (-> value), {arity: 0, async: false, ns: BUILTIN, name: "String '#{value}'"}
        when INTEGER
            fun_with_meta (-> value), {arity: 0, async: false, ns: BUILTIN, name: "Integer '#{value}'"}
        when FLOAT
            fun_with_meta (-> value), {arity: 0, async: false, ns: BUILTIN, name: "Float '#{value}'"}
        else
            throw "Unknown primitive type: #{type}/#{value}"

get_value_handler = (type, value, cell, dom_parser) ->
    switch type
        when NAN, NULL, KEYWORD, STRING, INTEGER, FLOAT
            get_primitive_value_handler type, value
        when VECTOR
            fun_with_meta(
                (cont) ->
                    process_vector value, cell, dom_parser, (res) ->
                        cont res
                {async: true, arity: 1, protocol: BUILTIN, name: "Vector"}
            )
        when HASHMAP
            fun_with_meta(
                (key) -> if key then value[key] else value
                {arity: 1, async: false, protocol: BUILTIN, name: "Hashmap"}
            )
        else
            throw "Unknown type: #{type}"

make_nested_expr = (dom_parser, current_cell, handler) ->
    # will build strictly on initialization
    # f = make_monadized_handler dom_parser, current_cell, cont, handler
    fun_with_meta(
        (cont) ->
            # will build lazy on invocation
            f = make_monadized_handler dom_parser, current_cell, cont, handler
            f 'here we go'

        {async: true, arity: 1, protocol: BUILTIN, name: NESTED_EXPR}
    )


process_ast_handler_node = (current_cell, dom_parser, handler) ->
    _get_cell = (id) ->
        cell = find_cell id, current_cell, dom_parser

        unless cell
            error "Unknown cell referenced in handler", id, handler
            throw "Unknown cell referenced in handler"

        cell

    switch handler.type
        when FUNCTION
            dispatch_handler handler.ns, handler.name, (_get_cell (handler.scope or THIS))

        when PARTIAL_FN
            USE_LAZY_PARTIAL_ARGS = true

            h = (dispatch_handler handler.fn.ns,
                                  handler.fn.name,
                                  (_get_cell (handler.fn.scope or THIS)))

            if USE_LAZY_PARTIAL_ARGS
                ## lazy args
                {vargs, arity} = h.meta

                fun_with_meta(
                    (args...) ->
                        # TODO vargs support
                        accepted_args = args[0...arity]

                        process_vector handler.args, current_cell, dom_parser, (calculated_args) ->
                            if h.meta.async
                                h (calculated_args.concat accepted_args)...
                            else
                                [raw_accepted_args..., cont] = accepted_args
                                cont (h (calculated_args.concat raw_accepted_args)...)

                    arity: arity
                    async: true
                    name: "partial application of #{h.meta.name}"
                    protocol: h.meta.protocol
                )

            else
                ## strict args, only sync
                (partial h, (handler.args.map ({type, value}) ->
                    unless type in DNA_PRIMITIVES
                        throw "Only primitive datatypes accepted as partial args"
                    (get_primitive_value_handler type, value)())...)

        when NESTED_EXPR
            make_nested_expr dom_parser, current_cell, handler.value

        when QUOTED_NESTED_EXPR
            throw "QUOTED_NESTED_EXPR is not implemented yet"

        when NAN, NULL, KEYWORD, STRING, INTEGER, FLOAT, VECTOR, HASHMAP
            (get_value_handler handler.type,
                               handler.value,
                               (_get_cell (handler.scope or THIS)),
                               dom_parser)

        else
            error "Unknown expression type: #{handler.type}", handler
            throw "Unknown expression type: #{handler.type}"


make_extended_node = (dom_parser, node) ->
    protocols = ((dom_parser.getData DNA_EXTEND, node).split " ").filter (i) -> !!i
    save_cell (synthesize_cell node, protocols, dom_parser)

process_meta = (cell, h) ->
    # TODO
    h

make_monadized_handler = (dom_parser, cell, cont, handlr) ->
    ast_parser = partial process_ast_handler_node, cell, dom_parser
    do_meta = partial process_meta, cell
    lifted_handlers_chain = handlr.seq.map (compose3 lift, do_meta, ast_parser)
    wrapper_monad = cont_t (logger_t (maybe_m {is_error: is_null}), devnull)

    fun_with_meta(
        (init_val) ->
            #debug "Starting DNA monadic sequence with arguments:", init_val
            (domonad wrapper_monad, lifted_handlers_chain, init_val) cont

        {async: true, arity: 1, name: 'monadized-handler'}
    )

bind_handlers_to_event = (dom_parser, cell, handlers, event_node) ->
    {type, args, name, ns, scope} = if event_node.type is 'partial-event'
        type:   'partial-event'
        args:   event_node.args.map (partial process_ast_handler_node,
                                             cell,
                                             dom_parser)
        name:   event_node.event.name
        ns:     event_node.event.ns
        scope:  event_node.event.scope
    else
        type:   'event'
        args:   []
        name:   event_node.name
        ns:     event_node.ns
        scope:  event_node.scope

    event_binder = (dispatch_handler ns,
                                     name,
                                     (find_cell (scope or THIS),
                                                cell,
                                                dom_parser))
    # TBD delegate this later
    handlers.map (handlr) ->
        event_binder (args.concat [handlr])...


make_subscribed_node = (dom_parser, node) ->
    cell = get_create_cell node.id, node, dom_parser

    genes = parse_genome (dom_parser.getData DNA_SUBSCRIBE, cell.node)
    # debug "DNA AST for", cell, ":", genes

    genes.map (gene) ->
        gene.events.map (partial bind_handlers_to_event,
                                 dom_parser,
                                 cell,
                                 (gene.handlers.map (partial make_monadized_handler,
                                                             dom_parser,
                                                             cell,
                                                             default_handlers_cont)))

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
    start_synthesis: (root_node) ->
        # Entry point
        unless root_node
            error "Root node not specified"
            throw "Root node not specified"

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
