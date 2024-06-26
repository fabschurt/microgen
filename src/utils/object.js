const PROP_PATH_PATTERN = /^(?<currentKey>[a-z_]+)(?<rest>(?:\.[a-z_]+)*)$/i

const valueIsObject = (value) => value.constructor?.name === 'Object'

const valueIsArray = (value) => value.constructor?.name === 'Array'

const valueIsComposite = (value) => valueIsObject(value) || valueIsArray(value)

const objectIsEmpty = (obj) => Object.keys(obj).length > 0

const matchPropPath = (propPath) => propPath.match?.(PROP_PATH_PATTERN) ?? null

export const deepCloneObject = (obj) => JSON.parse(JSON.stringify(obj))

export const transformObjectValues = (obj, cb) => {
  if (!valueIsComposite(obj)) {
    throw new TypeError('Only composite values can be transformed.')
  }

  for (const [key, val] of Object.entries(obj)) {
    if (valueIsComposite(val)) {
      transformObjectValues(val, cb)
    } else {
      cb(obj, key)
    }
  }

  return obj
}

export const cleanUpObjectList = (objectList) => objectList.filter(objectIsEmpty)

export const mergeObjectList = (objectList) => {
  const output = Object.assign({}, objectList.shift())

  for (const obj of objectList) {
    for (const [key, val] of Object.entries(obj)) {
      if (key in output && valueIsObject(output[key]) && valueIsObject(val)) {
        output[key] = mergeObjectList([output[key], val])
      } else {
        output[key] = val
      }
    }
  }

  return output
}

export const accessObjectProp = (obj, propPath) => {
  const match = matchPropPath(propPath)

  if (match === null) {
    throw new Error(`The property path \`${propPath}\` is invalid.` )
  }

  const currentKey = match.groups.currentKey

  if (!(currentKey in obj)) {
    throw new RangeError(`The key \`${currentKey}\` does not exist in the current object tree.`)
  }

  const rest = match.groups.rest
  const hasRest = Boolean(rest.length)
  const currentValue = obj[currentKey]

  if (hasRest && !valueIsObject(currentValue)) {
    throw new TypeError(`The value at key \`${currentKey}\` is not an object and can’t be traversed.`)
  }

  return (
    hasRest
      ? accessObjectProp(currentValue, rest.substring(1))
      : currentValue
  )
}

export const dotFlattenObject = (obj) => {
  if (!valueIsComposite(obj)) {
    throw new TypeError('Only composite values can be flattened.')
  }

  const output = {}

  for (const [prop, val] of Object.entries(obj)) {
    if (valueIsComposite(val)) {
      for (const [subProp, subVal] of Object.entries(dotFlattenObject(val))) {
        output[`${prop}.${subProp}`] = subVal
      }
    } else {
      output[prop] = val
    }
  }

  return output
}
