import expect, { spyOn } from 'expect'
import React, { Component } from 'react'
import { Model } from 'falcor'
import {
  renderIntoDocument,
  findRenderedComponentWithType
} from 'react-addons-test-utils'
import { Provider } from '../src/index'
import { modelType } from '../src/PropTypes'

describe('React', () => {
  describe('Provider', () => {
    class Child extends Component {
      static contextTypes = {
        model: modelType.isRequired
      }
      render() {
        return <div />
      }
    }

    it('should enforce a single child', () => {
      const model = new Model()
      const propTypes = Provider.propTypes
      Provider.propTypes = {}

      try {
        expect(() => renderIntoDocument(
          <Provider model={model}>
            <div />
          </Provider>
        )).toNotThrow(/exactly one child/)

        expect(() => renderIntoDocument(
          <Provider model={model}>
            <div />
            <div />
          </Provider>
        )).toThrow(/exactly one child/)
      } finally {
        Provider.propTypes = propTypes
      }
    })
    it('should add the model to the child context', () => {
      const model = new Model()
      const spy = spyOn(console, 'error')
      const tree = renderIntoDocument(
        <Provider model={model}>
          <Child />
        </Provider>
      )
      spy.destroy()
      expect(spy.calls.length).toBe(0)
      const child = findRenderedComponentWithType(tree, Child)
      expect(child.context.model).toBe(model)
    })
    it('should warn once when receiving a new model in props', () => {
      const model1 = new Model({
        cache: {
          number: 10
        }
      })
      const model2 = new Model({
        cache: {
          number: 11
        }
      })
      const model3 = new Model({
        cache: {
          number: 12
        }
      })

      class ProviderContainer extends Component { // eslint-disable-line
        constructor() {
          super()
          this.state = { model: model1 }
        }
        render() {
          return (
            <Provider model={this.state.model}>
              <Child />
            </Provider>
          )
        }
      }
      const container = renderIntoDocument(<ProviderContainer />)
      const child = findRenderedComponentWithType(container, Child)
      expect(child.context.model.getCache()).toEqual({ number: 10 })

      let spy = spyOn(console, 'error')
      container.setState({ model: model2 })
      spy.destroy()

      expect(child.context.model.getCache()).toEqual({ number: 10 })
      expect(spy.calls.length).toBe(1)
      expect(spy.calls[0].arguments[0]).toBe(
        '<Provider> does not support changing `model` on the fly.'
      )

      spy = expect.spyOn(console, 'error')
      container.setState({ model: model3 })
      spy.destroy()

      expect(child.context.model.getCache()).toEqual({ number: 10 })
      expect(spy.calls.length).toBe(0)
    })
  })
})
