
say = (a...) -> console.log.apply console, a

Implementations = {}


register_protocol_impl = (protocol, impl) ->
    Implementations[protocol] = impl

dispatch_impl = (protocol, node, rest...) ->
    # forget about rest for now
    if Implementations[protocol]
        Implementations[protocol](node)
    else
        null

dispatch_handler = (current_cell, handler_ns, fn) ->
    if current_cell.receptors[fn]
        current_cell.receptors[fn]
    else
        say "Handler missing for #{fn} @ #{handler_ns}"
        -> say "Missing handler #{fn} @ #{handler_ns}"


module.exports = {register_protocol_impl, dispatch_impl, dispatch_handler}