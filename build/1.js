(function() {
  var say;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  say = console.log;

  YUI().use('node', 'event', 'util', function(Y) {
    var DNA, IDraggable, IPositionReporter, Interface;
    console.log('Entering');
    Interface = (function() {

      function Interface(sel) {
        this.el = Y.one(sel);
      }

      return Interface;

    })();
    IDraggable = (function() {

      __extends(IDraggable, Interface);

      function IDraggable() {
        IDraggable.__super__.constructor.apply(this, arguments);
      }

      return IDraggable;

    })();
    IPositionReporter = (function() {

      __extends(IPositionReporter, Interface);

      function IPositionReporter() {
        IPositionReporter.__super__.constructor.apply(this, arguments);
      }

      return IPositionReporter;

    })();
    return DNA = (function() {

      function DNA() {
        say(Y.all('[data-extend-with]'));
      }

      return DNA;

    })();
  });

}).call(this);
