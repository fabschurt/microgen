import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir, generateNonExistentPath } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { ifPathExists, readFile } from '#src/utils/fs'
import { parseJSONFile } from '#src/utils/json'

describe('#src/utils/json', () => {
  describe('parseJSONFile()', () => {
    it('tries to parse a file as a JSON stream (defaulting to an empty object)', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const filePath = prefixWithTempDir('data.json')

        await fs.writeFile(filePath, '{"person": {"name": "Jamez", "surname": "Bong"}}')

        assert.deepStrictEqual(
          await parseJSONFile(ifPathExists, readFile, filePath),
          {
            person: {
              name: 'Jamez',
              surname: 'Bong',
            },
          },
        )
        assert.deepStrictEqual(
          await parseJSONFile(ifPathExists, readFile, generateNonExistentPath()),
          {},
        )
      })
    })
  })
})
