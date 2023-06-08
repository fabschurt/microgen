import * as fs from 'node:fs/promises'
import { join } from 'node:path'

export function withDir(dirPath) {
  return async function runCallback(cb) {
    await fs.access(dirPath)

    const prefixWithDir = (relativePath = '') => join(dirPath, relativePath)

    return cb(prefixWithDir)
  }
}

export function withScratchDir(dirPath) {
  return async function runCallback(cb) {
    try {
      await fs.access(dirPath)
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }

      await fs.mkdir(dirPath, { recursive: true })
    }

    await fs.access(dirPath, fs.constants.W_OK)

    const prefixWithDir = (relativePath = '') => join(dirPath, relativePath)

    return cb(prefixWithDir)
  }
}

export async function ifPathExists(path, cb, defaultReturn = false) {
  try {
    await fs.access(path)
  } catch (err) {
    return defaultReturn
  }

  return cb(path)
}

export function readFile(path) {
  return fs.readFile(path, { encoding: 'utf8' })
}

export function writeFile(path, content) {
  return fs.writeFile(path, content)
}

export function copyDir(srcPath, destPath) {
  return fs.cp(srcPath, destPath, {
    recursive: true,
    force: false,
    errorOnExist: true,
  })
}

export function rmDir(path) {
  if (path === '/') {
    throw new SystemError('Removing the filesystem’s root is not allowed.')
  }

  return fs.rm(path, { recursive: true })
}
