import invariant from 'invariant'

export function range({ from, to }, obj) {
  if (from !== 0) {
    invariant(from, 'please provide `from` argument to `range` function')
  }
  if (to !== 0) {
    invariant(to, 'please provide `to` arguments to `range` function')
  }
  invariant(obj, 'please provide object in fragments notation as a second argument')
  if (to < from) {
    invariant(null, '`to` cannot be greater than `from`')
  }
  const result = {}
  for (let i = from; i <= to; i++) {
    result[i] = obj
  }
  return result
}
