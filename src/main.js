import {
  withDir,
  withScratchDir,
  ifPathExists,
  readFile,
  writeFile,
  copyDir,
  rmDir,
} from '#src/lib/utils/fs'
import { parseData, renderIndex, copyAssetDir } from '#src/lib/build'
import { parseDataFromJsonFile, parseDataFromEnv } from '#src/lib/data'
import { parseTranslations } from '#src/lib/i18n'
import { parseJson } from '#src/lib/utils/json'
import renderTemplate from '#src/lib/renderTemplate/pug'

export default async function microgen(
  srcDirPath,
  buildDirPath,
  lang = null,
  envVars = {},
) {
  await ifPathExists(buildDirPath, rmDir)

  const [withSrcDir, withBuildDir] = await Promise.all([
    withDir(srcDirPath),
    withScratchDir(buildDirPath),
  ])

  const data = await parseData(
    withSrcDir,
    ifPathExists,
    readFile,
    parseJson,
    parseDataFromJsonFile,
    parseDataFromEnv,
    parseTranslations,
    lang,
    envVars,
  )

  return Promise.all([
    renderIndex(withSrcDir, withBuildDir, readFile, writeFile, renderTemplate, data),
    copyAssetDir(withSrcDir, withBuildDir, copyDir, ifPathExists),
  ])
}
