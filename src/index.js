import {
  withDir,
  withScratchDir,
  ifPathExists,
  readFile,
  writeFile,
  copyDir,
  rmDir,
} from '#src/utils/fs'
import { parseData, renderIndex, copyAssetDir } from '#src/build'
import { parseDataFromJsonFile, parseDataFromEnv } from '#src/data'
import { parseTranslations } from '#src/i18n'
import { parseJson } from '#src/utils/json'
import renderTemplate from '#src/renderTemplate/pug'

export default async function buildProject(
  srcDirPath,
  buildDirPath,
  lang = null,
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
    process.env,
    lang,
  )

  return Promise.all([
    renderIndex(withSrcDir, withBuildDir, readFile, writeFile, renderTemplate, data),
    copyAssetDir(withSrcDir, withBuildDir, copyDir, ifPathExists),
  ])
}
