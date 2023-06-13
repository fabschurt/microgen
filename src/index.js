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
import { parseJson } from '#src/utils/json'
import renderTemplate from '#src/renderTemplate/pug'

export default async function buildProject(srcDirPath, buildDirPath) {
  await ifPathExists(buildDirPath, rmDir)

  const withSrcDir = await withDir(srcDirPath)
  const withBuildDir = await withScratchDir(buildDirPath)

  return Promise.all([
    renderIndex(
      withSrcDir,
      withBuildDir,
      readFile,
      writeFile,
      ifPathExists,
      parseJson,
      renderTemplate,
    ),
    copyAssetDir(
      withSrcDir,
      withBuildDir,
      copyDir,
      ifPathExists,
    ),
  ])
}
