(function() {
  var register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  register_protocol_impl('ICalendar', function(node) {
    return (function(node) {
      var cal, cont;
      cont = Y.Node.create('<span>');
      node.insert(cont, 'after');
      cal = new Y.Calendar({
        contentBox: cont,
        width: '340px'
      });
      cal.render().hide();
      return {
        show: function() {
          cal.show();
          return cal.visible = true;
        },
        hide: function() {
          cal.hide();
          return cal.visible = false;
        },
        toggle: function() {
          if (cal.visible) {
            cal.hide();
            return cal.visible = false;
          } else {
            cal.show();
            return cal.visible = true;
          }
        },
        setDate: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return alert('not implemented yet');
        },
        onSelectionChange: function(f) {
          return cal.on('selectionChange', function(ev) {
            say('selectionChange');
            return f.impl(ev.newSelection[0]);
          });
        },
        getContainer: function() {
          return cont;
        }
      };
    })(node);
  });

}).call(this);
