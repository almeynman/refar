require('babel-core/register')
require('babel-polyfill')
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '../../../lib'
import { Model } from 'falcor'
import Hello from './Hello'

const model = new Model({
  cache: {
    hello: 'Hello'
  }
})

ReactDOM.render(
  <Provider model={model}>
    <Hello />
  </Provider>,
  document.getElementById('root')
)
