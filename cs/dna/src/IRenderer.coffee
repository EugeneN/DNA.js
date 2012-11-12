{register_protocol_impl} = require 'libprotocol'

say = (a...) -> console.log.apply console, a

DISPATCH_ATTR = 'renderer-type'
FORMAT_ATTR = 'render-date-format'
DEFAULT_FORMAT = '%x %c'
TYPE = 'date'

register_protocol_impl 'IRenderer', (node) ->
    do (node) ->
        {
            render: (value) ->
                format = (node.getData FORMAT_ATTR) or DEFAULT_FORMAT

                date = new Date value
                Y.Date.format date, {format}

            _dispatch: (args...) ->
                (node.getData DISPATCH_ATTR) is TYPE

        }
