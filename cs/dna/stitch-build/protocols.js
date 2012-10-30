(function() {
  var DEFAULT_PROTOCOLS, Protocols, get_protocol;

  Protocols = {
    IDraggable: [['setX', ['x']], ['setY', ['y']], ['setXY', ['x', 'y']], ['onDragStart', ['f']], ['onDragStop', ['f']]],
    IPositionReporter: [['getX', []], ['getY', []], ['getXY', []]],
    IDom: [['setContent', ['new_content']], ['alert', ['msg']], ['click', ['handler']], ['say', ['msgs']]]
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
