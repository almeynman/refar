'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = range;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function range(_ref, obj) {
  var from = _ref.from;
  var to = _ref.to;

  if (from !== 0) {
    (0, _invariant2["default"])(from, 'please provide `from` argument to `range` function');
  }
  if (to !== 0) {
    (0, _invariant2["default"])(to, 'please provide `to` arguments to `range` function');
  }
  (0, _invariant2["default"])(obj, 'please provide object in fragments notation as a second argument');
  if (to < from) {
    (0, _invariant2["default"])(null, '`to` cannot be greater than `from`');
  }
  var result = {};
  for (var i = from; i <= to; i++) {
    result[i] = obj;
  }
  return result;
}