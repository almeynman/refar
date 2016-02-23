'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPathValues = toPathValues;

var _toPaths = require('./toPaths');

var _falcor = require('falcor');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var $pathValue = _falcor.Model.pathValue;

function toPathValues(obj) {
  return (0, _toPaths.toPaths)(obj, true, true).map(function (path) {
    return $pathValue(path, (0, _get2["default"])(obj, path));
  });
}