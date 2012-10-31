(function() {
  var register_protocol_impl, say,
    __slice = [].slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  register_protocol_impl('ICalendar', function(node) {
    return (function(node) {
      var cal;
      cal = new Y.Calendar({
        contentBox: node,
        width: '340px'
      });
      cal.render();
      return {
        show: function() {
          return cal.show();
        },
        hide: function() {
          return cal.hide();
        },
        setDate: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return alert('not implemented yet');
        },
        onSelectionChange: function(f) {
          return cal.on('selectionChange', function(ev) {
            return f.impl(ev.newSelection[0]);
          });
        }
      };
    })(node);
  });

}).call(this);
