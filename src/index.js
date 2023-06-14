import {
  withDir,
  withScratchDir,
  ifPathExists,
  readFile,
  writeFile,
  copyDir,
  rmDir,
} from '#src/utils/fs'
import { renderIndex, copyAssetDir } from '#src/build'
import { parseFromJsonFile, parseFromEnv } from '#src/data'
import { parseTranslations } from '#src/i18n'
import { parseJson } from '#src/utils/json'
import renderTemplate from '#src/renderTemplate/pug'

export default async function buildProject(srcDirPath, buildDirPath, lang = null) {
  await ifPathExists(buildDirPath, rmDir)

  const withSrcDir = await withDir(srcDirPath)
  const withBuildDir = await withScratchDir(buildDirPath)

  const data = {
    ...(await parseDataFromJsonFile(withSrcDir, ifPathExists, readFile, parseJson)),
    ...parseDataFromEnv(process.env),
  }

  if (lang) {
    data.t = await parseTranslations(withSrcDir, ifPathExists, readFile, parseJson, lang)
  }

  return Promise.all([
    renderIndex(withSrcDir, withBuildDir, readFile, writeFile, renderTemplate, data),
    copyAssetDir(withSrcDir, withBuildDir, copyDir, ifPathExists),
  ])
}
