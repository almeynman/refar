import { PropTypes } from 'react'
import { Model } from 'falcor'

const { instanceOf } = PropTypes

export const modelType = instanceOf(Model)
