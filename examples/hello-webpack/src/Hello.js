import React from 'react'
import { createContainer } from '../../../lib'

class Hello extends React.Component { // a little worker
  static propTypes = {
    hello: React.PropTypes.string,
    name: React.PropTypes.string,
    updateName$: React.PropTypes.any
  };
  render() {
    return (
      <div>
        <div>Here you are</div>
        <div>{this.props.hello} {this.props.name}</div>
        <div><input onChange={e => this.props.updateName$.next(e.target.value)} /></div>
      </div>
    )
  }
}

export default createContainer(Hello, {
  fragments() {
    return {
      hello: null,
      name: null
    }
  },
  interactions(model, intents) {
    const updateName$ = intents.get('updateName')
    updateName$.
      subscribe(name => model.setLocal({ name }))
    return {
      updateName$
    }
  }
})
