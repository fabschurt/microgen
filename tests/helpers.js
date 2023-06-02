import { tmpdir } from 'node:os'
import { mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'

const TMP_DIR_PREFIX = 'microgen-tests-'

export async function withTempDir(cb) {
  const tempDirPath = await mkdtemp(join(tmpdir(), TMP_DIR_PREFIX))
  const returnValue = await cb(tempDirPath)
  await rm(tempDirPath, { recursive: true })

  return returnValue
}
