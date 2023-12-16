function valueIsComposite(value) {
  return ['Object', 'Array'].includes(value.constructor.name)
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
