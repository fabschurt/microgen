import { withDir, withWritableDir, readFile, writeFile, copyFile } from '#src/fs'
import { renderIndex, copyCssFile } from '#src/build'
import renderTemplate from '#src/renderTemplate/pug'

export default async function main(srcDirPath, buildDirPath) {
  const withSrcDir = await withDir(srcDirPath)
  const withBuildDir = await withWritableDir(buildDirPath)

  return Promise.all([
    renderIndex(
      withSrcDir,
      withBuildDir,
      readFile,
      writeFile,
      renderTemplate,
    ),
    copyCssFile(
      withSrcDir,
      withBuildDir,
      copyFile,
    ),
  ])
}
