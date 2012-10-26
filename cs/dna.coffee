
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

alertable = (node) ->
    do (node) ->
        {
            alert: (m) -> 
                t = node.getHTML()
                alert 'hello', m
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
YUI().use 'node', 'event', 'dd', (Y) ->
    say 'Entering'

    window.Y = Y if DEBUG

    x = Y.all "[data-#{DA_EXTEND}]"

    x.each (node) ->
        node.generateID()

        protocols = ((node.getData DA_EXTEND).split " ").filter (i) -> !!i
        say "Protocols found for #{node}: #{protocols}"

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

        # walk down node children and subscribe any declared events to be handled
        # by molecule's handlers
        
        parse_genome = (require 'genome-parser').parse

        node.all("[data-#{DA_SUBSCRIBE}]").each (s_node) ->
            subscriptions = parse_genome (s_node.getData DA_SUBSCRIBE)

            say "Subscriptions for #{s_node}:", subscriptions

            proto_event = subscriptions.events[0]?.event.name
            src_proto = subscriptions.events[0]?.ns?.name

            handler_name = subscriptions.handlers[0]?.method.name
            handler_ns = subscriptions.handlers[0]?.ns?.name

            say "XXX:", proto_event, src_proto, handler_name, handler_ns
            
            handler = (ev) ->
                say "Handler here:", proto_event, src_proto, handler_name, handler_ns
                s_node.setContent new_cell.if[handler_name]()

            if src_proto and proto_event
                new_cell.if[proto_event] handler
            else
                s_node.on src_proto, handler



    say 'Cells born for this document:', CELLS
    say "Exiting"
        
