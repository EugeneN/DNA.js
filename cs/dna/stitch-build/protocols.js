(function() {
  var DEFAULT_PROTOCOLS, Protocols, get_protocol;

  Protocols = {
    IDraggable: [['setX', ['x']], ['setY', ['y']], ['setXY', ['x', 'y']], ['onDragStart', ['f']], ['onDragStop', ['f']]],
    IMovable: [['moveUp', ['x']], ['moveDown', ['x']], ['moveLeft', ['x']], ['moveRight', ['x']]],
    IPositionReporter: [['getX', []], ['getY', []], ['getXY', []]],
    IDom: [['setContent', ['new_content']], ['setValue', ['new_value']], ['alert', ['msg']], ['click', ['handler']], ['say', ['msgs']], ['appendContent', ['content']], ['kill', []], ['setAttr', ['attr']]],
    ICalendar: [['show', []], ['hide', []], ['toggle', []], ['setDate', ['date']], ['onSelectionChange', ['f']], ['add', ['interval', 'date']]]
  };

  DEFAULT_PROTOCOLS = ['IDom'];

  get_protocol = function(p) {
    return Protocols[p];
  };

  module.exports = {
    Protocols: Protocols,
    DEFAULT_PROTOCOLS: DEFAULT_PROTOCOLS,
    get_protocol: get_protocol
  };

}).call(this);
