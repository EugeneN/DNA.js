
DEBUG = true
DA_EXTEND = 'extend-with'
DA_SUBSCRIBE = 'subscribe'


say = (a...) -> console.log.apply console, a

Protocols =
    IDraggable: [
        ['setX', ['x']]
        ['setY', ['y']]
        ['setXY', ['x', 'y']]
        ['onDragStart', ['f']]
        ['onDragStop', ['f']]
    ]

    IPositionReporter: [
        ['getX', []]
        ['getY', []]
        ['getXY', []]
    ]

    IAlertable: [
        ['alert', ['m']]
    ]

    IDom: [
        ['setContent', ['new_content']]
    ]

DEFAULT_PROTOCOLS = ['IDom']

Implementations = {}

CELLS = {}

dispatch_impl = (protocol, node, rest...) ->
    # forget about rest for now
    if Implementations[protocol]
        Implementations[protocol](node)
    else
        null

register_protocol_impl = (protocol, impl) ->
    Implementations[protocol] = impl
#------------------------------------------------------------------------------

dom_impl = (node) ->
    do (node) ->
        {
            setContent: (args...) ->
                say 'IDom impl', node, args
                node.setContent args
        }
register_protocol_impl 'IDom', dom_impl

alertable = (node) ->
    do (node) ->
        {
            alert: (m) -> 
                t = node.getHTML()
                say '====>', m
                alert "<#{m}>"
                t
        }

register_protocol_impl 'IAlertable', alertable

yui_draggable = (node) ->
    do (node) ->
        dd = new Y.DD.Drag {node}

        {
            setX: (x) -> node.setX x
            setY: (y) -> node.setY y
            setXY: (xy) -> node.setXY xy
            onDragStart: (f) -> dd.on 'drag:start', f
            onDragStop: (f) -> dd.on 'drag:end', f
        }

register_protocol_impl 'IDraggable', yui_draggable


yui_position_reporter = (node) ->
        do (node) ->
            {
                getX: ->
                    x = node.getX()
                    say x
                    "#{x}px"

                getY: ->
                    y = node.getY()
                    say y
                    y

                getXY: ->
                    xy = node.getXY()
                    say xy
                    xy
            }

register_protocol_impl 'IPositionReporter', yui_position_reporter

say Implementations

#------------------------------------------------------------------------------
dispatch_handler = (current_ns, handler_ns, fn) -> 
    say '>>>>', current_ns, handler_ns, fn
    if current_ns.if[fn]
        current_ns.if[fn]
    else
        say "Handler missing for #{fn} @ #{handler_ns}"
        -> say "Missing handler #{fn} @ #{handler_ns}"

synthesize_cell = (node, protocols) ->
    new_cell =
        id: node.id
        if: {}

    protocols.map (protocol) ->
        p = Protocols[protocol]
        impl_inst = dispatch_impl protocol, node

        if p and impl_inst
            p.map ([fn, attrs]) ->
                new_cell.if[fn] = impl_inst[fn]

    CELLS[node.id] = new_cell

    new_cell

parse_ast_node = (handler, current_node, cell) ->
    handler_name = handler.method?.name
    handler_type = handler.method?.type
    handler_value = handler.method?.value

    handler_ns = handler.ns?.name

    current_cell = if handler_ns is 'this'
        synthesize_cell current_node, DEFAULT_PROTOCOLS
    else
        cell

    switch handler_type
        when 'string'    then -> handler_value
        when 'number'    then -> handler_value
        when 'list'      then -> handler_value
        when 'hashmap'   then -> handler_value

        else dispatch_handler current_cell, handler_ns, handler_name


YUI().use 'node', 'event', 'dd', (Y) ->
    say 'Cells synthesis started'

    window.Y = Y if DEBUG

    x = Y.all "[data-#{DA_EXTEND}]"

    x.each (node) ->
        node.generateID()

        protocols = ((node.getData DA_EXTEND).split " ").filter (i) -> !!i
        say "Protocols found for #{node}: #{protocols}"

        new_cell = synthesize_cell node, protocols

        # walk down node children and subscribe any declared events to be handled
        # by cells's handlers
        
        parse_genome = (require 'genome-parser').parse

        node.all("[data-#{DA_SUBSCRIBE}]").each (s_node) ->
            subscriptions = parse_genome (s_node.getData DA_SUBSCRIBE)

            say "Subscriptions for #{s_node}:", subscriptions

            handlers = subscriptions.handlers.map (h) ->
                if Array.isArray h
                    handler_chain = h.map (z) -> parse_ast_node z, s_node, new_cell
                    _.compose(handler_chain...)
                else
                    parse_ast_node h, s_node, new_cell

            subscriptions.events.map (e) ->
                event_name = e.event?.name
                event_ns = e.ns?.name

                handlers.map (h) ->
                    # delegate this later
                    if event_ns
                        new_cell.if[event_name] h
                    else
                        s_node.on event_name, h


    say 'Cells synthesized for this document:', CELLS
    say "Cells synthesis complete."
        
