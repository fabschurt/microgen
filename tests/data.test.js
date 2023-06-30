import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir } from '#tests/helpers'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { withDir, ifPathExists, readFile } from '#src/utils/fs'
import { parseJson } from '#src/utils/json'
import { parseDataFromJsonFile, parseDataFromEnv } from '#src/data'

describe('#src/data', () => {
  describe('parseDataFromJsonFile()', () => {
    it('parses data from a pre-defined JSON file', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('src')
        const jsonFilePath = join(dirPath, 'data.json')

        await mkdir(dirPath)
        await writeFile(jsonFilePath, '{"stuff": ["thing", "trinket", "gizmo"]}')

        assert.deepStrictEqual(
          await parseDataFromJsonFile(withDir(dirPath), ifPathExists, readFile, parseJson),
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

    it('returns an empty object if the data file does not exist', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('src')

        await mkdir(dirPath)

        assert.deepStrictEqual(
          await parseDataFromJsonFile(withDir(dirPath), ifPathExists, readFile, parseJson),
          {}
        )
      })
    })
  })

  describe('parseDataFromEnv()', () => {
    it('extracts data from the environment (thanks to a special prefix)', () => {
      assert.deepStrictEqual(
        parseDataFromEnv({
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
