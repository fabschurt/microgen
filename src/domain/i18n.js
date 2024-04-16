import assert from 'node:assert'
import { join } from 'node:path'

const LANG_PATTERN = /^[a-z]{2}$/
const TRANSLATION_DIR_PATH = 'i18n'
const TRANSLATION_FILE_EXT = '.json'

export const parseProjectTranslations = (
  (parseJSONFile, withSrcDir) => (
    (lang) => {
      assert.match(lang, LANG_PATTERN, `\`${lang}\` is not a valid language code.`)

      return withSrcDir((prefixWithSrcDir) => {
        const translationFilePath = join(
          prefixWithSrcDir(TRANSLATION_DIR_PATH),
          lang + TRANSLATION_FILE_EXT,
        )

        return parseJSONFile(translationFilePath)
      })
    }
  )
)
