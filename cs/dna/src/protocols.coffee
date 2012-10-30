
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

    IDom: [
        ['setContent', ['new_content']]
        ['alert', ['msg']]
        ['click', ['handler']]
        ['say', ['msgs']]
    ]

DEFAULT_PROTOCOLS = ['IDom']

get_protocol = (p) ->
    Protocols[p]


module.exports = {Protocols, DEFAULT_PROTOCOLS, get_protocol}