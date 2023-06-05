import {
  withDir,
  withWritableDir,
  readFile,
  writeFile,
  copyFile,
  ifExists,
} from '#src/utils/fs'
import { renderIndex, copyCssFile } from '#src/build'
import { parseJson } from '#src/utils/json'
import renderTemplate from '#src/renderTemplate/pug'

export default async function buildProject(srcDirPath, buildDirPath) {
  const withSrcDir = await withDir(srcDirPath)
  const withBuildDir = await withWritableDir(buildDirPath)

  return Promise.all([
    renderIndex(
      withSrcDir,
      withBuildDir,
      readFile,
      writeFile,
      ifExists,
      parseJson,
      renderTemplate,
    ),
    copyCssFile(
      withSrcDir,
      withBuildDir,
      copyFile,
      ifExists,
    ),
  ])
}
