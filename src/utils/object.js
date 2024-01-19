import assert from 'node:assert'

function valueIsObject(value) {
  return typeof value !== 'undefined' && value.constructor.name === 'Object'
}

function valueIsArray(value) {
  return typeof value !== 'undefined' && value.constructor.name === 'Array'
}

function valueIsComposite(value) {
  return valueIsObject(value) || valueIsArray(value)
}

function testPropPathValidity(propPath) {
  return /^(?<currentKey>[a-z_]+)(?<rest>(?:\.[a-z_]+)*)$/i.exec(propPath)
}

export function deepCloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function transformObjectValues(obj, cb) {
  if (!valueIsComposite(obj)) {
    throw new TypeError('This function only supports plain Object and Array objects.')
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

export function cleanUpObjectList(objectList) {
  return objectList.filter((obj) => Object.keys(obj).length)
}

export function mergeObjectList(objectList) {
  return Object.assign({}, ...objectList)
}

export function accessObjectProp(obj, propPath) {
  const match = testPropPathValidity(propPath)

  assert.notStrictEqual(match, null, `The property path «${propPath}» is invalid.` )

  const currentKey = match.groups.currentKey

  if (typeof obj[currentKey] === 'undefined') {
    throw new RangeError(`The key «${currentKey}» does not exist in the current object tree.`)
  }

  const rest = match.groups.rest
  const hasRest = Boolean(rest.length)

  if (hasRest && !valueIsObject(obj[currentKey])) {
    throw new TypeError(`The value at key «${currentKey}» is not an object and can’t be traversed.`)
  }

  return (
    hasRest
      ? accessObjectProp(obj[currentKey], rest.substring(1))
      : obj[currentKey]
  )
}
