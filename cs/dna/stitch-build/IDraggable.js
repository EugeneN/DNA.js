(function() {
  var register_protocol_impl, say;
  var __slice = Array.prototype.slice;

  register_protocol_impl = require('libprotocol').register_protocol_impl;

  say = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, a);
  };

  register_protocol_impl('IDraggable', function(node) {
    return (function(node) {
      var dd;
      dd = new Y.DD.Drag({
        node: node
      });
      return {
        setX: function(x) {
          return node.setX(x + 10);
        },
        setY: function(y) {
          return node.setY(y + 10);
        },
        setXY: function(xy) {
          return node.setXY(xy);
        },
        onDragStart: function(f) {
          return dd.on('drag:start', f);
        },
        onDragStop: function(f) {
          return dd.on('drag:end', f);
        }
      };
    })(node);
  });

  register_protocol_impl('IMovable', function(node) {
    return (function(node) {
      return {
        moveUp: function(x) {
          return node.setY(node.getY() - parseInt(x));
        },
        moveDown: function(x) {
          return node.setY(node.getY() + parseInt(x));
        },
        moveLeft: function(x) {
          return node.setX(node.getX() - parseInt(x));
        },
        moveRight: function(x) {
          return node.setX(node.getX() + parseInt(x));
        }
      };
    })(node);
  });

  register_protocol_impl('IPositionReporter', function(node) {
    return (function(node) {
      return {
        getX: function() {
          var x;
          x = node.getX();
          say(x);
          return "" + x + "px";
        },
        getY: function() {
          var y;
          y = node.getY();
          say(y);
          return y;
        },
        getXY: function() {
          var xy;
          xy = node.getXY();
          say(xy);
          return xy;
        }
      };
    })(node);
  });

}).call(this);
