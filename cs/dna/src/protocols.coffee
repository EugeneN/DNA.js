
Protocols =
    IDraggable: [
        ['setX', ['x']]
        ['setY', ['y']]
        ['setXY', ['x', 'y']]
        ['onDragStart', ['f']]
        ['onDragStop', ['f']]
    ]

    IMovable: [
        ['moveUp', ['x']]
        ['moveDown', ['x']]
        ['moveLeft', ['x']]
        ['moveRight', ['x']]
    ]

    IPositionReporter: [
        ['getX', []]
        ['getY', []]
        ['getXY', []]
    ]

    IDom: [
        ['setContent', ['new_content']]
        ['setValue', ['new_value']]
        ['alert', ['msg']]
        ['click', ['handler']]
        ['say', ['msgs']]
        ['appendContent', ['content']]
        ['kill', []]
    ]

    ICalendar: [
        ['show', []]
        ['hide', []]
        ['setDate', ['date']]
        ['onSelectionChange', ['f']]
    ]

DEFAULT_PROTOCOLS = ['IDom']

get_protocol = (p) ->
    Protocols[p]


module.exports = {Protocols, DEFAULT_PROTOCOLS, get_protocol}