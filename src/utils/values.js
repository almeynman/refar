import isEmpty from 'lodash/isEmpty'

export function values(obj) {
  if (!obj || isEmpty(obj)) {
    return []
  }
  return Object.
    keys(obj).
    filter(key => key !== '$__path').
    map(key => obj[key])
}
