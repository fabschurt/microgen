import * as fs from 'node:fs/promises'
import { join } from 'node:path'

export function withDir(dirPath) {
  return async function runCallback(cb) {
    await fs.access(dirPath)

    const dirPrefixer = (relativePath) => join(dirPath, relativePath)

    return cb(dirPrefixer)
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

    const dirPrefixer = (relativePath) => join(dirPath, relativePath)

    return cb(dirPrefixer)
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

export function copyFile(srcPath, destPath) {
  return fs.copyFile(srcPath, destPath)
}
