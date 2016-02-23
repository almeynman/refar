import 'babel-polyfill'
import { collapse } from 'falcor-path-utils'
import isPlainObject from 'lodash/isPlainObject'
import invariant from 'invariant'

function *iterateTree(value, jsonGraph, path = []) {
  if (!isPlainObject(value)) {
    yield path
  } else if (jsonGraph && value && value.$type) {
    yield path
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const newPath = path.slice()
        newPath.push(key)
        yield *iterateTree(value[key], jsonGraph, newPath)
      }
    }
  }
}

export function toPaths(tree, jsonGraph = false, noCollapse = false) {
  if (!isPlainObject(tree)) {
    invariant(null, 'Please provide a plain object to `toPaths`')
  }
  const paths = []
  for (const path of iterateTree(tree, jsonGraph)) {
    paths.push(path)
  }
  if (noCollapse) {
    return paths
  }
  return collapse(paths)
}
