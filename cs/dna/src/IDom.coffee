{register_protocol_impl} = require 'libprotocol'

say = (a...) -> console.log.apply console, a

register_protocol_impl 'IDom', (node) ->
    do (node) ->
        {
            setContent: (args...) ->
                say 'IDom impl', node, args
                node.setContent args

            alert: (args...) ->
                alert args...

        }

