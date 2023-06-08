import {
  withDir,
  withScratchDir,
  readFile,
  writeFile,
  copyDir,
  ifPathExists,
} from '#src/utils/fs'
import { renderIndex, copyAssetDir } from '#src/build'
import { parseJson } from '#src/utils/json'
import renderTemplate from '#src/renderTemplate/pug'

export default async function buildProject(srcDirPath, buildDirPath) {
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
