import React from 'react'
import { createContainer } from '../../../lib'
import { Model } from 'falcor'

const $pathValue = Model.pathValue

class Hello extends React.Component { // a little worker
  static propTypes = {
    hello: React.PropTypes.string,
    name: React.PropTypes.string,
    updateName$: React.PropTypes.any
  };
  render() {
    return (
      <div>
        <div>{this.props.hello} {this.props.name}</div>
        <div><input onChange={e => this.props.updateName$.next(e.target.value)} /></div>
      </div>
    )
  }
}

export default createContainer(Hello, {
  fragments() {
    // return [['hello'], ['name']] // also possible
    return {
      hello: null,
      name: null
    }
  },
  interactions(model, intents) {
    const updateName$ = intents.get('updateName')
    updateName$.
    // subscribe(name => model.local.set($pathValue(['name'], name))) // also possible
      subscribe(name => model.local.set({ name }))

    return {
      updateName$
    }
  }
})
