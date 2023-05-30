import * as fs from 'node:fs/promises'
import { join as joinPaths } from 'node:path'

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

export async function createDirPrefixer(dirPath) {
  const dir = await fs.opendir(dirPath)

  return function prefixRelativePath(relPath) {
    return joinPaths(dir.path, relPath)
  }
}

export async function createWritableDirPrefixer(dirPath, relativePath) {
  const dir = await openOrCreateDir(dirPath)

  await fs.access(dir.path, fs.constants.W_OK)

  return function prefixRelativePath(relPath) {
    return joinPaths(dir.path, relPath)
  }
}

export async function writeToFile(dest, content) {
  return fs.writeFile(dest, content)
}

export async function copyFile(src, dest) {
  return fs.copyFile(src, dest)
}
