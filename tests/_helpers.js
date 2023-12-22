import * as fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const TMP_DIR_PREFIX = 'microgen-tests-'

export async function withTempDir(cb) {
  const tempDirPath = await fs.mkdtemp(join(tmpdir(), TMP_DIR_PREFIX))
  const prefixWithDir = (relativePath = '') => join(tempDirPath, relativePath)

  try {
    return await cb(prefixWithDir)
  } finally {
    await fs.rm(tempDirPath, { recursive: true })
  }
}

export function generateNonExistentPath() {
  return join(tmpdir(), randomUUID())
}

export function noop() {}
