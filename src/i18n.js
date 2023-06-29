import assert from 'node:assert'
import { join } from 'node:path'

const LANG_PATTERN = /^[a-z]{2}$/
const TRANSLATION_DIR_PATH = 'i18n'
const TRANSLATION_FILE_PREFIX = '.json'

export function parseTranslations(
  withSrcDir,
  ifPathExists,
  readFile,
  parseJson,
  lang,
) {
  assert.match(lang, LANG_PATTERN)

  return withSrcDir((prefixWithSrcDir) => {
    const translationFilePath = join(
      prefixWithSrcDir(TRANSLATION_DIR_PATH),
      lang + TRANSLATION_FILE_PREFIX,
    )

    return ifPathExists(
      translationFilePath,
      async () => parseJson(await readFile(translationFilePath)),
      {}
    )
  })
}
