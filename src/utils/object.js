import assert from 'node:assert'

const valueIsObject = (value) => (
  typeof value !== 'undefined' &&
  value.constructor.name === 'Object'
)

const valueIsArray = (value) => (
  typeof value !== 'undefined' &&
  value.constructor.name === 'Array'
)

const valueIsComposite = (value) => valueIsObject(value) || valueIsArray(value)

const testPropPathValidity = (propPath) => (
  /^(?<currentKey>[a-z_]+)(?<rest>(?:\.[a-z_]+)*)$/i
    .exec(propPath)
)

export const deepCloneObject = (obj) => JSON.parse(JSON.stringify(obj))

export const transformObjectValues = (obj, cb) => {
  if (!valueIsComposite(obj)) {
    throw new TypeError('Only composite values can be transformed.')
  }

  Object.keys(obj).forEach((key) => {
    if (valueIsComposite(obj[key])) {
      transformObjectValues(obj[key], cb)
    } else {
      cb(obj, key)
    }
  })

  return obj
}

export const cleanUpObjectList = (objectList) => objectList.filter((obj) => Object.keys(obj).length)

export const mergeObjectList = (objectList) => Object.assign({}, ...objectList)

export const accessObjectProp = (obj, propPath) => {
  const match = testPropPathValidity(propPath)

  assert.notStrictEqual(match, null, `The property path \`${propPath}\` is invalid.` )

  const currentKey = match.groups.currentKey

  if (typeof obj[currentKey] === 'undefined') {
    throw new RangeError(`The key \`${currentKey}\` does not exist in the current object tree.`)
  }

  const rest = match.groups.rest
  const hasRest = Boolean(rest.length)

  if (hasRest && !valueIsObject(obj[currentKey])) {
    throw new TypeError(`The value at key \`${currentKey}\` is not an object and can’t be traversed.`)
  }

  return (
    hasRest
      ? accessObjectProp(obj[currentKey], rest.substring(1))
      : obj[currentKey]
  )
}
