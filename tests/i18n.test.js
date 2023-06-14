import { describe, it } from 'node:test'
import assert from 'node:assert'
import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { withTempDir } from '#tests/helpers'
import { withDir, ifPathExists, readFile } from '#src/utils/fs'
import { parseJson } from '#src/utils/json'
import { parseTranslations } from '#src/i18n'

describe('#src/i18n', () => {
  describe('parseTranslations()', () => {
    it('parses a translation file from a pre-defined directory', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const translationDirPath = join(srcDirPath, 'i18n')
        const file1Path = join(translationDirPath, 'fr.json')
        const file2Path = join(translationDirPath, 'en.json')

        await mkdir(translationDirPath, { recursive: true })
        await writeFile(file1Path, '{"greetings": "Bonjour"}')
        await writeFile(file2Path, '{"greetings": "Hello"}')

        const withSrcDir = withDir(srcDirPath)

        assert.deepStrictEqual(
          await parseTranslations(withSrcDir, ifPathExists, readFile, parseJson, 'fr'),
          { greetings: 'Bonjour' },
        )
        assert.deepStrictEqual(
          await parseTranslations(withSrcDir, ifPathExists, readFile, parseJson, 'en'),
          { greetings: 'Hello' },
        )
        assert.deepStrictEqual(
          await parseTranslations(withSrcDir, ifPathExists, readFile, parseJson, 'de'),
          {},
        )
      })
    })

    it('throws if an invalid `lang` parameter is passed', async () => {
      await assert.rejects(
        parseTranslations(
          withDir(tmpdir()),
          ifPathExists,
          readFile,
          parseJson,
          'fAiL',
        )
      )
    })
  })
})
