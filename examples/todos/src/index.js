require('babel-core/register')
require('babel-polyfill')
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from '../../../lib'
import { Model } from 'falcor'
import Todos from './Todos'

const $ref = Model.ref
const model = new Model({
  cache: {
    todos: {
      0: $ref(['todosById', 123]),
      1: $ref(['todosById', 234]),
      2: $ref(['todosById', 345]),
      3: $ref(['todosById', 456])
    },
    todosById: {
      123: {
        id: 123,
        text: 'learn react',
        completed: false
      },
      234: {
        id: 234,
        text: 'learn rxjs',
        completed: false
      },
      345: {
        id: 345,
        text: 'learn falcor',
        completed: false
      },
      456: {
        id: 456,
        text: 'use refar with ease',
        completed: false
      }
    }
  }
})

ReactDOM.render(
  <Provider model={model}>
    <Todos />
  </Provider>,
  document.getElementById('root')
)
