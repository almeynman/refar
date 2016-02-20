import expect, { spyOn } from 'expect'
import React, { Component } from 'react'
import { Model } from 'falcor'
import {
  renderIntoDocument,
  findRenderedComponentWithType
} from 'react-addons-test-utils'
import { createContainer, Provider } from '../src/index'

describe('React', () => {
  describe('createContainer', () => {
    class Passthrough extends Component {
      render() {
        return <div {...this.props} />
      }
    }

    it('should receive the model in the context', () => {
      const model = new Model({
        cache: {
          name: 'test'
        }
      })
      const Container = createContainer(Passthrough, {
        fragments() {
          return {
            name: null
          }
        }
      })
      const tree = renderIntoDocument(
        <Provider model={model}>
          <Container />
        </Provider>
      )

      const container = findRenderedComponentWithType(tree, Container)
      expect(container.context.model).toBe(model)
    })
  })
})
