(function() {
  var DEFAULT_FORMAT, DISPATCH_ATTR, FORMAT_ATTR, TYPE, register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  DISPATCH_ATTR = 'renderer-type';

  FORMAT_ATTR = 'render-date-format';

  DEFAULT_FORMAT = '%x %c';

  TYPE = 'date';

  register_protocol_impl('IRenderer', function(node) {
    return (function(node) {
      return {
        render: function(value) {
          var date, format;
          format = (node.getData(FORMAT_ATTR)) || DEFAULT_FORMAT;
          date = new Date(value);
          return Y.Date.format(date, {
            format: format
          });
        },
        _dispatch: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return (node.getData(DISPATCH_ATTR)) === TYPE;
        }
      };
    })(node);
  });

}).call(this);
