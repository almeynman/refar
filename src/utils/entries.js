import isEmpty from 'lodash/isEmpty'

export function entries(obj) {
  if (!obj || isEmpty(obj)) {
    return []
  }
  return Object.
    keys(obj).
    filter(key => key !== '$__path').
    map(key => ({ key, value: obj[key] }))
}
