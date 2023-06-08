import { tmpdir } from 'node:os'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const TMP_DIR_PREFIX = 'microgen-tests-'

export async function withTempDir(cb) {
  const tempDirPath = await mkdtemp(join(tmpdir(), TMP_DIR_PREFIX))
  const prefixWithDir = (relativePath = '') => join(tempDirPath, relativePath)

  try {
    return await cb(prefixWithDir)
  } finally {
    await rm(tempDirPath, { recursive: true })
  }
}

export function generateNonExistentPath() {
  return join(tmpdir(), randomUUID())
}

export function noop() {}
