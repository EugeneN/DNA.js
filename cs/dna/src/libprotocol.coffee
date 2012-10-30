
say = (a...) -> console.log.apply console, a

Implementations = {}
THIS = 'this'


register_protocol_impl = (protocol, impl) ->
    say "Registering an implementation for the protocol #{protocol}"
    Implementations[protocol] = impl

dispatch_impl = (protocol, node, rest...) ->
    # forget about rest for now
    try
        require protocol
    catch e
        say "Can't find a single module for an implementation of the protocol '#{protocol}'"

    if Implementations[protocol]
        Implementations[protocol](node)
    else
        null

dump_impls = ->
    say "Currently registered implementations:", Implementations


module.exports = {register_protocol_impl, dispatch_impl, dump_impls}