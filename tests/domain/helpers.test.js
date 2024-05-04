import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import { withDir, ifPathExists } from '#src/utils/fs'
import { importCustomHelpers } from '#src/domain/helpers'

describe('#src/domain/helpers', () => {
  describe('importCustomHelpers()', () => {
    it('parses exports from a `helpers.js` file', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const filePath = join(srcDirPath, 'helpers.mjs')

        await fs.mkdir(srcDirPath)
        await fs.writeFile(filePath, `
export const sayHello = () => 'Hello World!'

export const add2 = (num) => num + 2
`)

        const helpers = await importCustomHelpers(withDir(srcDirPath), ifPathExists)

        assert('sayHello' in helpers)
        assert('add2' in helpers)
        assert.strictEqual(helpers.sayHello(), 'Hello World!')
        assert.strictEqual(helpers.add2(4), 6)
      })
    })
  })
})
