import { toPaths } from './toPaths'
import { Model } from 'falcor'
import get from 'lodash/get'

const $pathValue = Model.pathValue

export function toPathValues(obj) {
  return toPaths(obj, true, true).map(path => $pathValue(path, get(obj, path)))
}
