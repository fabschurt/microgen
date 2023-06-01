import * as os from 'node:os'
import * as fs from 'node:fs'
import { join as joinPaths } from 'node:path'

const TMP_DIR_PREFIX = 'microgen-tests-'

export function withTempDir(cb) {
  const tempDirPath = fs.mkdtempSync(joinPaths(os.tmpdir(), TMP_DIR_PREFIX))
  const returnValue = cb(tempDirPath)
  fs.rmSync(tempDirPath, { recursive: true })

  return returnValue
}
