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

function iterateTree(value, jsonGraph) {
  var path = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
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
          _context.next = 19;
          break;

        case 5:
          if (!(jsonGraph && value && value.$type)) {
            _context.next = 10;
            break;
          }

          _context.next = 8;
          return path;

        case 8:
          _context.next = 19;
          break;

        case 10:
          _context.t0 = regeneratorRuntime.keys(value);

        case 11:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 19;
            break;
          }

          key = _context.t1.value;

          if (!value.hasOwnProperty(key)) {
            _context.next = 17;
            break;
          }

          newPath = path.slice();

          newPath.push(key);
          return _context.delegateYield(iterateTree(value[key], jsonGraph, newPath), 't2', 17);

        case 17:
          _context.next = 11;
          break;

        case 19:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function toPaths(tree) {
  var jsonGraph = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  var noCollapse = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (!(0, _isPlainObject2["default"])(tree)) {
    (0, _invariant2["default"])(null, 'Please provide a plain object to `toPaths`');
  }
  var paths = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterateTree(tree, jsonGraph)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

  if (noCollapse) {
    return paths;
  }
  return (0, _falcorPathUtils.collapse)(paths);
}