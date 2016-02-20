import expect from 'expect'
import { toPaths } from '../../src/utils/toPaths'

describe('Utils', () => {
  describe('toPaths', () => {
    it('should throw if not plain object was not provided', () => {
      let input = null
      expect(() => toPaths(input)).
        toThrow('Please provide a plain object to `toPaths`')

      input = [1, 2, 3]
      expect(() => toPaths(input)).
        toThrow('Please provide a plain object to `toPaths`')
    })
    it('should return paths given a tree', () => {
      const input = {
        a1: {
          b1: {
            c1: {
              d1: null,
              d2: 'd2'
            },
            c2: {
              d3: 'd3'
            }
          },
          b2: {
            c3: null
          }
        },
        a2: {
          b3: {
            0: {
              c4: 'c4'
            },
            1: {
              c4: null
            },
            2: {
              c4: 'c4'
            }
          }
        },
        a3: null
      }
      const output = [
        ['a3'],
        ['a1', 'b2', 'c3'],
        ['a1', 'b1', 'c1', ['d1', 'd2']],
        ['a1', 'b1', 'c2', 'd3'],
        ['a2', 'b3', { from: 0, to: 2 }, 'c4']
      ]
      expect(toPaths(input)).toEqual(output)
    })
  })
})
