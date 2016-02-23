import { Component, PropTypes, Children } from 'react'
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import invariant from 'invariant'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'

import { toPathValues, toPaths } from './utils'
import { modelType } from './PropTypes'

let didWarnAboutReceivingModel = false
function warnAboutReceivingModel() {
  if (didWarnAboutReceivingModel) {
    return
  }
  didWarnAboutReceivingModel = true

  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(
      '<Provider> does not support changing `model` on the fly.'
    )
  }
  /* eslint-disable no-console */
}

export class Provider extends Component {
  static propTypes = {
    model: modelType.isRequired,
    children: PropTypes.element.isRequired
  }
  static childContextTypes = {
    model: modelType.isRequired,
    intentFactory: PropTypes.object.isRequired
  }
  getChildContext() { // eslint-disable-line
    const { model, intentFactory } = this
    return { model, intentFactory }
  }
  constructor(props, context) {
    super(props, context)
    this.model = props.model

    // changes to model should be broadcasted
    // TODO do I need getVersion?
    this.model.$ = new BehaviorSubject(this.model.getVersion()) // 1 here is a initial value
    const previousOnChange = this.model._root.onChange
    this.model._root.onChange = () => {
      if (previousOnChange) {
        previousOnChange()
      }
      this.model.$.next(this.model.getVersion())
    }

    this.model.local = this.model.withoutDataSource()
    // local updates
    const previousSet = this.model.local.set
    this.model.local.set = (...pathValues) => {
      invariant(pathValues && pathValues.length > 0, `set must accept either
        falcor's pathValue object or a plain object`)
      let finalPathValues
      if (pathValues.length === 1 && isPlainObject(pathValues[0]) && !pathValues[0].path) {
        finalPathValues = toPathValues(pathValues[0])
      } else {
        finalPathValues = pathValues
      }
      previousSet.apply(this.model.local, finalPathValues).then(() => {})
    }

    this.model.local.delete = (...paths) => {
      invariant(paths && paths.length > 0, `delete must accept either
        falcor's paths or a plain object`)
      let finalPaths
      if (isPlainObject(paths[0])) {
        finalPaths = toPaths(paths[0], true, true)
      }
      if (isArray(paths[0])) {
        finalPaths = paths
      }
      const pathValues = finalPaths.map(path => ({ path, value: { $type: 'atom', '$expires': 0 } }))
      previousSet.apply(this.model.local, pathValues).then(() => {})
    }

    // create intents
    this.intentFactory = {}
    this.intentFactory.get = name => {
      invariant(name, 'Invalid name for the intent collection.')
      if (!this.intentFactory[name]) {
        this.intentFactory[name] = new Subject()
      }
      return this.intentFactory[name]
    }
  }
  render() {
    const { children } = this.props
    return Children.only(children)
  }
}

if (process.env.NODE_ENV !== 'production') {
  Provider.prototype.componentWillReceiveProps = function (nextProps) { // eslint-disable-line
    const { model } = this
    const { model: nextModel } = nextProps

    if (model !== nextModel) {
      warnAboutReceivingModel()
    }
  }
}
