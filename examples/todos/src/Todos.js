import React from 'react'
import { Model } from 'falcor'
import { createContainer, range, entries } from '../../../lib'
import Todo from './Todo'

const $ref = Model.ref

const randomNumber = () => Math.floor(Math.random() * 1000000);

class Todos extends React.Component { // a little worker
  render() {
    const todosArray = entries(this.props.todos)
    const lastIndex = todosArray.length !== 0
    ? Object.keys(this.props.todos).reduce((acc, x) => acc < x ? x : acc, 0)
    : 0
    return (
      <div>
        {
          todosArray.map(({ key, value: todo }) => (
            <div key={todo.id}>
              <Todo {...todo} index={key} />
            </div>
          ))
        }
        <div>
          <input
            value={this.props.newTodoText}
            onChange={e => this.props.newTodoText$.next(e.target.value)}
          />
          <button onClick={e => this.props.addTodo$.next({
            text: this.props.newTodoText, index: lastIndex + 1
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
        ...range({ from: 0, to: 29},
          Todo.fragments()
        )
      }
    }
  },
  interactions(model, intents) {
    const newTodoText$ = intents.get('newTodoText')
    newTodoText$.subscribe(text => model.local.set({ newTodoText: text }))

    const addTodo$ = intents.get('addTodo')
    addTodo$.
      subscribe(({ text, index }) => {
        const id = randomNumber()
        model.local.set({
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
