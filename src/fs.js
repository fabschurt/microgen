import * as fs from 'node:fs/promises'

async function openOrCreateDir(dirPath) {
  try {
    return await fs.opendir(dirPath)
  } catch (err) {
    if (err.code != 'ENOENT') {
      throw err
    }

    await fs.mkdir(dirPath, { recursive: true })

    return fs.opendir(dirPath)
  }
}

export function withDir(dirPath) {
  return async function runCallbackWithDir(cb) {
    const dir = await fs.opendir(dirPath)
    const returnValue = cb(dir.path)
    dir.close()

    return returnValue
  }
}

export function withWritableDir(dirPath) {
  return async function runCallbackWithDir(cb) {
    const dir = await openOrCreateDir(dirPath)
    await fs.access(dir.path, fs.constants.W_OK)
    const returnValue = cb(dir.path)
    dir.close()

    return returnValue
  }
}

export function readFile(path) {
  return fs.readFile(path)
}

export function writeFile(path, content) {
  return fs.writeFile(path, content)
}

export function copyFile(srcPath, destPath) {
  return fs.copyFile(srcPath, destPath)
}
