'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entries = entries;

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function entries(obj) {
  if (!obj || (0, _isEmpty2["default"])(obj)) {
    return [];
  }
  return Object.keys(obj).filter(function (key) {
    return key !== '$__path';
  }).map(function (key) {
    return { key: key, value: obj[key] };
  });
}