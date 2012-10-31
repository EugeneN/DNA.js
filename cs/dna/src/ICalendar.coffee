{register_protocol_impl} = require 'libprotocol'

say = (a...) -> console.log.apply console, a

register_protocol_impl 'ICalendar', (node) ->
    do (node) ->
        cal = new Y.Calendar
            contentBox: node
            width: '340px'

        cal.render()


        {
            show: ->
                cal.show()

            hide: ->
                cal.hide()

            setDate: (args...) ->
                alert 'not implemented yet'

            onSelectionChange: (f) ->
                cal.on 'selectionChange', (ev) ->
                    f.impl ev.newSelection[0]


        }

