{register_protocol_impl} = require 'libprotocol'

say = (a...) -> console.log.apply console, a

register_protocol_impl 'IDraggable', (node) ->
    do (node) ->
        dd = new Y.DD.Drag {node}

        {
            setX: (x) -> node.setX x
            setY: (y) -> node.setY y
            setXY: (xy) -> node.setXY xy
            onDragStart: (f) -> dd.on 'drag:start', f
            onDragStop: (f) -> dd.on 'drag:end', f
        }

register_protocol_impl 'IPositionReporter', (node) ->
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

