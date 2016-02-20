import 'babel-polyfill'
import { collapse } from 'falcor-path-utils'
import isPlainObject from 'lodash/isPlainObject'
import invariant from 'invariant'

function *iterateTree(value, path = []) {
  if (!isPlainObject(value)) {
    yield path
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const newPath = path.slice()
        newPath.push(key)
        yield *iterateTree(value[key], newPath)
      }
    }
  }
}

export function toPaths(tree) {
  if (!isPlainObject(tree)) {
    invariant(null, 'Please provide a plain object to `toPaths`')
  }
  const paths = []
  for (const path of iterateTree(tree)) {
    paths.push(path)
  }
  return collapse(paths)
}
