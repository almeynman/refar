'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _BehaviorSubject = require('rxjs/subject/BehaviorSubject');

var _Subject = require('rxjs/Subject');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _utils = require('./utils');

var _PropTypes = require('./PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var didWarnAboutReceivingModel = false;
function warnAboutReceivingModel() {
  if (didWarnAboutReceivingModel) {
    return;
  }
  didWarnAboutReceivingModel = true;

  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('<Provider> does not support changing `model` on the fly.');
  }
  /* eslint-disable no-console */
}

var Provider = exports.Provider = function (_Component) {
  _inherits(Provider, _Component);

  _createClass(Provider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      // eslint-disable-line
      var model = this.model;
      var intentFactory = this.intentFactory;

      return { model: model, intentFactory: intentFactory };
    }
  }]);

  function Provider(props, context) {
    _classCallCheck(this, Provider);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Provider).call(this, props, context));

    _this.model = props.model;

    // changes to model should be broadcasted
    // TODO do I need getVersion?
    _this.model.$ = new _BehaviorSubject.BehaviorSubject(_this.model.getVersion()); // 1 here is a initial value
    var previousOnChange = _this.model._root.onChange;
    _this.model._root.onChange = function () {
      if (previousOnChange) {
        previousOnChange();
      }
      _this.model.$.next(_this.model.getVersion());
    };

    _this.model.local = _this.model.withoutDataSource();
    // local updates
    var previousSet = _this.model.local.set;
    _this.model.local.set = function () {
      for (var _len = arguments.length, pathValues = Array(_len), _key = 0; _key < _len; _key++) {
        pathValues[_key] = arguments[_key];
      }

      (0, _invariant2["default"])(pathValues && pathValues.length > 0, 'set must accept either\n        falcor\'s pathValue object or a plain object');
      var finalPathValues = undefined;
      if (pathValues.length === 1 && (0, _isPlainObject2["default"])(pathValues[0]) && !pathValues[0].path) {
        finalPathValues = (0, _utils.toPathValues)(pathValues[0]);
      } else {
        finalPathValues = pathValues;
      }
      previousSet.apply(_this.model.local, finalPathValues).then(function () {});
    };

    _this.model.local["delete"] = function () {
      for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        paths[_key2] = arguments[_key2];
      }

      (0, _invariant2["default"])(paths && paths.length > 0, 'delete must accept either\n        falcor\'s paths or a plain object');
      var finalPaths = undefined;
      if ((0, _isPlainObject2["default"])(paths[0])) {
        finalPaths = (0, _utils.toPaths)(paths[0], true, true);
      }
      if ((0, _isArray2["default"])(paths[0])) {
        finalPaths = paths;
      }
      var pathValues = finalPaths.map(function (path) {
        return { path: path, value: { $type: 'atom', '$expires': 0 } };
      });
      previousSet.apply(_this.model.local, pathValues).then(function () {});
    };

    // create intents
    _this.intentFactory = {};
    _this.intentFactory.get = function (name) {
      (0, _invariant2["default"])(name, 'Invalid name for the intent collection.');
      if (!_this.intentFactory[name]) {
        _this.intentFactory[name] = new _Subject.Subject();
      }
      return _this.intentFactory[name];
    };
    return _this;
  }

  _createClass(Provider, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return _react.Children.only(children);
    }
  }]);

  return Provider;
}(_react.Component);

Provider.propTypes = {
  model: _PropTypes.modelType.isRequired,
  children: _react.PropTypes.element.isRequired
};
Provider.childContextTypes = {
  model: _PropTypes.modelType.isRequired,
  intentFactory: _react.PropTypes.object.isRequired
};


if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) {
    // eslint-disable-line
    var model = this.model;
    var nextModel = nextProps.model;


    if (model !== nextModel) {
      warnAboutReceivingModel();
    }
  };
}