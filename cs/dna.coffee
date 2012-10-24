
DEBUG = true
DA_EXTEND = 'data-extend-with'

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

MOLECULES = {}

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

    x = Y.all "[#{DA_EXTEND}]"

    x.each (node) ->
        node.generateID()

        protocols = ((node.getData 'extend-with').split " ").filter (i) -> !!i
        say "Protocols found for #{node}: #{protocols}"

        new_molecule =
            id: node.id
            if: {}

        protocols.map (protocol) ->
            p = Protocols[protocol]
            impl_inst = dispatch_impl protocol, node

            if p and impl_inst
                p.map ([fn, attrs]) ->
                    new_molecule.if[fn] = impl_inst[fn]

        MOLECULES[node.id] = new_molecule

        # walk down node children and subscribe any declared events to be handled
        # by molecule's handlers
        node.all('[data-subscribe]').each (s_node) ->
            subscriptions = ((s_node.getData 'subscribe').split " ").filter (i) -> !!i

            subscriptions.map (s) ->
                [event, handler_name] = s.split ':'

                [src_proto, proto_event] = event.split '.'

                handler = (ev) ->
                    say 'drag end handler here'
                    s_node.setContent new_molecule.if[handler_name]()

                if src_proto and proto_event
                    new_molecule.if[proto_event] handler
                else
                    s_node.on event, handler


    say MOLECULES
    say "Exiting"
        
