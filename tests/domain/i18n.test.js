import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir, noop } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import { withDir, ifPathExists, readFile } from '#src/utils/fs'
import { parseJSONFile } from '#src/utils/json'
import { dotFlattenObject } from '#src/utils/object'
import { parseProjectTranslations } from '#src/domain/i18n'

describe('#src/domain/i18n', () => {
  describe('parseProjectTranslations()', () => {
    it('parses ICU translation messages from a predefined directory', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const translationDirPath = join(srcDirPath, 'i18n')
        const file1Path = join(translationDirPath, 'fr.json')
        const file2Path = join(translationDirPath, 'en.json')

        await fs.mkdir(translationDirPath, { recursive: true })
        await fs.writeFile(file1Path, `
{
  "greetings": "Bonjour",
  "info": {
    "secret": {
      "astro_sign": "Sagittaire"
    },
    "goals": [
      "Effectuer le dab",
      "Jouer à «The Binding of Isaac»"
    ]
  }
}
`)
        await fs.writeFile(file2Path, `
{
  "greetings": "Hello",
  "info": {
    "secret": {
      "astro_sign": "Sagittarius"
    },
    "goals": [
      "Dabbing like hell",
      "Playing «The Binding of Isaac»"
    ]
  }
}
`)

        const withSrcDir = withDir(srcDirPath)
        const _parseJSONFile = (filePath) => parseJSONFile(ifPathExists, readFile, filePath)

        assert.deepStrictEqual(
          await parseProjectTranslations(_parseJSONFile, dotFlattenObject, withSrcDir, 'fr'),
          {
            'greetings': 'Bonjour',
            'info.secret.astro_sign': 'Sagittaire',
            'info.goals.0': 'Effectuer le dab',
            'info.goals.1': 'Jouer à «The Binding of Isaac»',
          },
        )
        assert.deepStrictEqual(
          await parseProjectTranslations(_parseJSONFile, dotFlattenObject, withSrcDir, 'en'),
          {
            'greetings': 'Hello',
            'info.secret.astro_sign': 'Sagittarius',
            'info.goals.0': 'Dabbing like hell',
            'info.goals.1': 'Playing «The Binding of Isaac»',
          },
        )
        assert.deepStrictEqual(
          await parseProjectTranslations(_parseJSONFile, dotFlattenObject, withSrcDir, 'de'),
          {},
        )
      })
    })

    it('throws if an invalid `lang` parameter is passed', () => {
      assert.throws(
        () => parseProjectTranslations(noop, noop, noop, 'fAiL'),
        assert.AssertionError,
      )
    })
  })
})
