import { Component, PropTypes, Children } from 'react'
import { BehaviorSubject } from 'rxjs/subject/BehaviorSubject'
import { Subject } from 'rxjs/Subject'
import invariant from 'invariant'

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
    intents: PropTypes.object.isRequired
  }
  getChildContext() { // eslint-disable-line
    const { model, intents } = this
    return { model, intents }
  }
  constructor(props, context) {
    super(props, context)
    this.model = props.model

    // updates model's cache locally
    // usefull for haveing local changes
    this.model.setLocal = obj => {
      this.model.setCache(Object.assign(this.model.getCache(), obj))
    }

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

    // create intents
    this.intents = {}
    this.intents.get = name => {
      invariant(name, 'Invalid name for the intent collection.')
      if (!this.intents[name]) {
        this.intents[name] = new Subject()
      }
      return this.intents[name]
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
