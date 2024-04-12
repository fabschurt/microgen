import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import { withDir, ifPathExists, readFile } from '#src/utils/fs'
import { parseJSONFile } from '#src/utils/json'
import { deepCloneObject, transformObjectValues } from '#src/utils/object'
import { parseProjectData, mergeDataWithEnvVars } from '#src/domain/data'

describe('#src/domain/data', () => {
  describe('parseProjectData()', () => {
    it('parses data from a `data.json` file at project root', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const dataFilePath = join(srcDirPath, 'data.json')

        await fs.mkdir(srcDirPath)
        await fs.writeFile(dataFilePath, '{"stuff": ["thing", "trinket", "gizmo"]}')

        const result = await parseProjectData(
          parseJSONFile(ifPathExists, readFile),
          withDir(srcDirPath),
        )

        assert.deepStrictEqual(
          result,
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

  describe('mergeDataWithEnvVars()', () => {
    it('recursively replaces placeholder object properties with env var values', () => {
      const data = {
        foo: 'bar',
        stuff: {
          mess: [
            42,
            '%SECRET_PHONE_NUMBER%',
            false,
            'LANG'
          ],
        },
        cruft: {
          dude: {
            name: 'John',
            lang: '%LANG%',
            phone: 'SECRET_PHONE_NUMBER',
          },
        },
      }

      const envVars = {
        SECRET_PHONE_NUMBER: '+33700000000',
        LANG: 'fr',
      }

      const result = mergeDataWithEnvVars(deepCloneObject, transformObjectValues)(data, envVars)

      assert.deepStrictEqual(
        result,
        {
          foo: 'bar',
          stuff: {
            mess: [
              42,
              '+33700000000',
              false,
              'LANG'
            ],
          },
          cruft: {
            dude: {
              name: 'John',
              lang: 'fr',
              phone: 'SECRET_PHONE_NUMBER',
            },
          },
        },
      )
    })
  })
})
