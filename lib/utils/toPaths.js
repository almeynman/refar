'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPaths = toPaths;

require('babel-polyfill');

var _falcorPathUtils = require('falcor-path-utils');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _marked = [iterateTree].map(regeneratorRuntime.mark);

function iterateTree(value) {
  var path = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
  var key, newPath;
  return regeneratorRuntime.wrap(function iterateTree$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if ((0, _isPlainObject2["default"])(value)) {
            _context.next = 5;
            break;
          }

          _context.next = 3;
          return path;

        case 3:
          _context.next = 14;
          break;

        case 5:
          _context.t0 = regeneratorRuntime.keys(value);

        case 6:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 14;
            break;
          }

          key = _context.t1.value;

          if (!value.hasOwnProperty(key)) {
            _context.next = 12;
            break;
          }

          newPath = path.slice();

          newPath.push(key);
          return _context.delegateYield(iterateTree(value[key], newPath), 't2', 12);

        case 12:
          _context.next = 6;
          break;

        case 14:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function toPaths(tree) {
  if (!(0, _isPlainObject2["default"])(tree)) {
    (0, _invariant2["default"])(null, 'Please provide a plain object to `toPaths`');
  }
  var paths = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterateTree(tree)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var path = _step.value;

      paths.push(path);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return (0, _falcorPathUtils.collapse)(paths);
}