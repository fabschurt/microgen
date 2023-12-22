import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir, noop } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import { withDir, ifPathExists, readFile } from '#src/utils/fs'
import { parseJSONFile } from '#src/utils/json'
import { parseProjectTranslations } from '#src/domain/i18n'

describe('#src/domain/i18n', () => {
  describe('parseProjectTranslations()', () => {
    it('parses a translation file from a predefined directory', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const translationDirPath = join(srcDirPath, 'i18n')
        const file1Path = join(translationDirPath, 'fr.json')
        const file2Path = join(translationDirPath, 'en.json')

        await fs.mkdir(translationDirPath, { recursive: true })
        await fs.writeFile(file1Path, '{"greetings": "Bonjour"}')
        await fs.writeFile(file2Path, '{"greetings": "Hello"}')

        const withSrcDir = withDir(srcDirPath)
        const _parseJSONFile = (filePath) => parseJSONFile(ifPathExists, readFile, filePath)

        assert.deepStrictEqual(
          await parseProjectTranslations(_parseJSONFile, withSrcDir, 'fr'),
          { greetings: 'Bonjour' },
        )
        assert.deepStrictEqual(
          await parseProjectTranslations(_parseJSONFile, withSrcDir, 'en'),
          { greetings: 'Hello' },
        )
        assert.deepStrictEqual(
          await parseProjectTranslations(_parseJSONFile, withSrcDir, 'de'),
          {},
        )
      })
    })

    it('throws if an invalid `lang` parameter is passed', () => {
      assert.throws(
        () => parseProjectTranslations(noop, noop, 'fAiL'),
        assert.AssertionError,
      )
    })
  })
})
