"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("./util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Class definition
var CAEventHandler = function () {
  ////////////////////////////
  // ** Private Variables  ** //
  ////////////////////////////
  var _handlers = {}; ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var _triggerEvent = function _triggerEvent(element, name, target, e) {
    if (_util["default"].data(element).has(name) === true) {
      var handlerId = _util["default"].data(element).get(name);

      if (_handlers[name] && _handlers[name][handlerId]) {
        var handler = _handlers[name][handlerId];

        if (handler.name === name) {
          if (handler.one == true) {
            if (handler.fired == false) {
              _handlers[name][handlerId].fired = true;
              return handler.callback.call(this, target, e);
            }
          } else {
            return handler.callback.call(this, target, e);
          }
        }
      }
    }

    return null;
  };

  var _addEvent = function _addEvent(element, name, callback, one) {
    var handlerId = _util["default"].getUniqueId('event');

    _util["default"].data(element).set(name, handlerId);

    if (!_handlers[name]) {
      _handlers[name] = {};
    }

    _handlers[name][handlerId] = {
      name: name,
      callback: callback,
      one: one,
      fired: false
    };
  };

  var _removeEvent = function _removeEvent(element, name) {
    var handlerId = _util["default"].data(element).get(name);

    if (_handlers[name] && _handlers[name][handlerId]) {
      delete _handlers[name][handlerId];
    }
  }; ////////////////////////////
  // ** Public Methods  ** //
  ////////////////////////////


  return {
    trigger: function trigger(element, name, target, e) {
      return _triggerEvent(element, name, target, e);
    },
    on: function on(element, name, handler) {
      return _addEvent(element, name, handler);
    },
    one: function one(element, name, handler) {
      return _addEvent(element, name, handler, true);
    },
    off: function off(element, name) {
      return _removeEvent(element, name);
    },
    debug: function debug() {
      for (var b in _handlers) {
        if (_handlers.hasOwnProperty(b)) console.log(b);
      }
    }
  };
}();

var _default = CAEventHandler;
exports["default"] = _default;