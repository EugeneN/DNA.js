{register_protocol_impl} = require 'libprotocol'

say = (a...) -> console.log.apply console, a

register_protocol_impl 'IDom', (node) ->
    do (node) ->
        {
            setContent: (args...) ->
                node.setContent args[0]

            setValue: (v) ->
                node.set 'value', v

            setAttr: (attr) ->
                say 'setattr'
                node.setAttribute attr

            appendContent: (content) ->
                node.append "<div>#{content}</div>"

            alert: (args...) ->
                alert args...

            click: (handler) ->
                node.on 'click', handler

            say: (args...) ->
                say args...

            proxylog: (args...) ->
                say args...
                args

            kill: ->
                say 'kill'
                node.remove()

        }

