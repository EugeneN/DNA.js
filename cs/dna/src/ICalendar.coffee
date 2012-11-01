{register_protocol_impl} = require 'libprotocol'

say = (a...) -> console.log.apply console, a

register_protocol_impl 'ICalendar', (node) ->
    do (node) ->
        cont = Y.Node.create '<span>'
        node.insert cont, 'after'

        cal = new Y.Calendar
            contentBox: cont
            width: '340px'

        cal.render().hide()

        {
            show: ->
                cal.show()
                cal.visible = true

            hide: ->
                cal.hide()
                cal.visible = false

            toggle: ->
                if cal.visible
                    cal.hide()
                    cal.visible = false
                else
                    cal.show()
                    cal.visible = true

            setDate: (args...) ->
                alert 'not implemented yet'

            onSelectionChange: (f) ->
                cal.on 'selectionChange', (ev) ->
                    # ev.newSelection[0] is YUI Calendar specific
                    f ev.newSelection[0]

            getContainer: ->
                cont


        }

