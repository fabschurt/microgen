import * as fs from 'node:fs/promises'
import { join } from 'node:path'

const prefixWithDir = (dirPath) => (relativePath = '') => join(dirPath, relativePath)

export const withDir = (
  (dirPath) => (
    async (cb) => {
      await fs.access(dirPath)

      return cb(prefixWithDir(dirPath))
    }
  )
)

export const withScratchDir = (
  (dirPath) => (
    async (cb) => {
      try {
        await fs.access(dirPath)
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err
        }

        await fs.mkdir(dirPath, { recursive: true })
      }

      await fs.access(dirPath, fs.constants.W_OK)

      return cb(prefixWithDir(dirPath))
    }
  )
)

export const ifPathExists = async (path, cb, defaultReturn = false) => {
  try {
    await fs.access(path)
  } catch (err) {
    return defaultReturn
  }

  return cb(path)
}

export const readFile = (path) => fs.readFile(path, { encoding: 'utf8' })

export const writeFile = (path, content) => fs.writeFile(path, content)

export const copyDir = (srcPath, destPath) => (
  fs.cp(srcPath, destPath, {
    recursive: true,
    force: false,
    errorOnExist: true,
  })
)

export const rmDir = (path) => {
  if (path === '/') {
    throw new SystemError('Removing the filesystem’s root is not allowed.')
  }

  return fs.rm(path, { recursive: true })
}
