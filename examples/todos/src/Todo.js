import React from 'react'
import { PureComponent } from 'react-pure-render'
import { createContainer } from '../../../lib'

class Todo extends PureComponent { // a little worker
  render() {
    const { id, text, completed } = this.props
    if (id === 456) {
      console.log(completed)
    }
    return (
      <div>
        <div>
          <input
            type="checkbox" defaultChecked={completed} // https://github.com/facebook/react/issues/3005
            onChange={e => e.stopPropagation() || this.props.toggleCompleted$.next({ completed: !completed, id })}
          />
          <input
            value={text}
            onChange={e => e.preventDefault() || this.props.changeText$.next({ text: e.target.value, id })}
          />
          <button onClick={e => this.props.deleteTodo$.next(this.props.index)}>
            Delete
          </button>
        </div>
      </div>
    )
  }
}

export default createContainer(Todo, {
  root: false,
  fragments() {
    return {
      id: null,
      text: null,
      completed: null
    }
  },
  interactions(model, intents) {
    const toggleCompleted$ = intents.get('toggleCompleted')
    toggleCompleted$.
      subscribe(({ completed, id }) => model.local.set({
        todosById: {
          [id]: {
            completed
          }
        }
      }))

    const changeText$ = intents.get('changeText')
    changeText$.
      subscribe(({ text, id }) => model.local.set({
        todosById: {
          [id]: {
            text
          }
        }
      }))

    const deleteTodo$ = intents.get('deleteTodo')
    deleteTodo$.
      // TODO what is a path syntax here
      subscribe(index => model.local.delete({
        todos: {
          [index]: null
        }
      }))

    return {
      toggleCompleted$,
      changeText$,
      deleteTodo$
    }
  }
})
