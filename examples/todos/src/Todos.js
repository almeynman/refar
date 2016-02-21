import React from 'react'
import { Model } from 'falcor'
import { createContainer, range, values } from '../../../lib'
import Todo from './Todo'

const $ref = Model.ref

const randomNumber = () => Math.floor(Math.random() * 1000000);

class Todos extends React.Component { // a little worker
  render() {
    const todosArray = values(this.props.todos)
    const length = todosArray.length
    return (
      <div>
        {
          todosArray.map(todo => (
            <div key={todo.id}>
              <Todo {...todo} />
            </div>
          ))
        }
        <div>
          <input
            value={this.props.newTodoText}
            onChange={e => this.props.newTodoText$.next(e.target.value)}
          />
          <button onClick={e => this.props.addTodo$.next({
            text: this.props.newTodoText, index: length
          })}
          >
            Add New Todo
          </button>
        </div>
      </div>
    )
  }
}

export default createContainer(Todos, {
  fragments() {
    return {
      newTodoText: null,
      todos: {
        ...range({ from: 0, to: 19},
          Todo.fragments()
        )
      }
    }
  },
  interactions(model, intents) {
    const newTodoText$ = intents.get('newTodoText')
    newTodoText$.subscribe(text => model.assign({ newTodoText: text }))

    const addTodo$ = intents.get('addTodo')
    addTodo$.
      subscribe(({ text, index }) => {
        const id = randomNumber()
        model.deepAssign({
          todos: { [index]: $ref(['todosById', id]) },
          todosById: {
            [id]: { id, text, completed: false }
          }
        })
        newTodoText$.next('')
      })

    return {
      addTodo$,
      newTodoText$
    }
  }
})
