'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createContainer = createContainer;

var _react = require('react');

var _Observable = require('rxjs/Observable');

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _PropTypes = require('./PropTypes');

var _toPaths = require('./utils/toPaths');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultInteractions = function defaultInteractions() {
  return {};
};

function createContainer(WrappedComponent, _ref) {
  var _ref$root = _ref.root;
  var root = _ref$root === undefined ? true : _ref$root;
  var fragments = _ref.fragments;
  var _ref$interactions = _ref.interactions;
  var interactions = _ref$interactions === undefined ? defaultInteractions : _ref$interactions;

  (0, _invariant2["default"])(fragments, 'There is no point of using createContainer\n    for ' + (WrappedComponent.displayName || WrappedComponent.name) + '\n    if you do not require data from model for it');
  if (fragments.constructor !== Function || interactions.constructor !== Function) {
    (0, _invariant2["default"])(null, 'both fragments and interactions of\n      ' + (WrappedComponent.displayName || WrappedComponent.name) + '\n      must be Function instances');
  }

  var Container = function (_Component) {
    _inherits(Container, _Component);

    function Container(props, context) {
      _classCallCheck(this, Container);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props, context));

      var model = context.model;
      var intentFactory = context.intentFactory;

      (0, _invariant2["default"])(model, 'Could not find "model" in the context\n        of "' + _this.constructor.displayName + '".\n        Please wrap the root component in a <Provider>');
      (0, _invariant2["default"])(intentFactory, 'Could not find "intentFactory" in the context\n        of "' + _this.constructor.displayName + '".\n        Please file an issue');
      // TODO consider using versions with getFragment
      _this.componentHasMounted = false;

      if (root) {
        _this.subscription = model.$.mergeMap(function (version) {
          var pathsAsArrayOrObject = fragments();
          var paths = undefined;
          if ((0, _isPlainObject2["default"])(pathsAsArrayOrObject)) {
            paths = (0, _toPaths.toPaths)(pathsAsArrayOrObject);
          }
          if ((0, _isPlainObject2["default"])(pathsAsArrayOrObject)) {
            paths = pathsAsArrayOrObject;
          }
          (0, _invariant2["default"])(paths, 'fragments of ' + _this.constructor.displayName + '\n            should return paths in form of falcor pathArray syntax or use\n            refar\'s object notation');
          return _Observable.Observable.fromPromise(model.get.apply(model, _toConsumableArray((0, _toPaths.toPaths)(fragments()))));
        }).subscribe(function (data) {
          if (!data) {
            return;
          }
          if (!_this.componentHasMounted) {
            _this.state = data.json;
            return;
          }
          _this.setState(data.json);
        });
      }

      // run interactions
      if (!Container.intents) {
        var intents = interactions(model, intentFactory);
        Container.intents = intents;
      }
      return _this;
    } // eslint-disable-line


    _createClass(Container, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.componentHasMounted = true;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (root) {
          // Clean-up subscription before un-mounting
          this.subscription.unsubscribe();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return (0, _react.createElement)(WrappedComponent, _extends({}, this.state, Container.intents, this.props));
      }
    }]);

    return Container;
  }(_react.Component);

  Container.displayName = (WrappedComponent.displayName || WrappedComponent.name) + 'Container';
  Container.contextTypes = {
    model: _PropTypes.modelType.isRequired,
    intentFactory: _react.PropTypes.object.isRequired
  };
  Container.fragments = fragments;


  return (0, _hoistNonReactStatics2["default"])(Container, WrappedComponent);
}