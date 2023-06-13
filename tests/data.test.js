import { describe, it } from 'node:test'
import assert from 'node:assert'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { withTempDir } from '#tests/helpers'
import { withDir, ifPathExists, readFile } from '#src/utils/fs'
import { parseJson } from '#src/utils/json'
import { parseFromJsonFile, parseFromEnv } from '#src/data'

describe('#src/data', () => {
  describe('parseFromJsonFile()', () => {
    it('parses data from a pre-defined JSON file', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('src')
        const jsonFilePath = join(dirPath, 'data.json')

        await mkdir(dirPath)
        await writeFile(jsonFilePath, '{"stuff": ["thing", "trinket", "gizmo"]}')

        assert.deepStrictEqual(
          await parseFromJsonFile(
            withDir(dirPath),
            ifPathExists,
            readFile,
            parseJson,
          ),
          {
            stuff: [
              'thing',
              'trinket',
              'gizmo',
            ],
          },
        )
      })
    })
  })

  describe('parseFromEnv()', () => {
    it('extracts data from the environment (thanks to a special prefix)', () => {
      assert.deepStrictEqual(
        parseFromEnv({
          EDITOR: 'vim',
          LANG: 'en_US.UTF-8',
          _MG_SECRET_PHONE_NUMBER: '+33777777777',
          SHELL: '/bin/bash',
          _MG_EMAIL_ADDRESS: 'void@null.net',
        }),
        {
          secret_phone_number: '+33777777777',
          email_address: 'void@null.net',
        }
      )
    })
  })
})
