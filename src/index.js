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
import { parseJson } from '#src/utils/json'
import renderTemplate from '#src/renderTemplate/pug'

export default async function buildProject(srcDirPath, buildDirPath) {
  await ifPathExists(buildDirPath, rmDir)

  const withSrcDir = await withDir(srcDirPath)
  const withBuildDir = await withScratchDir(buildDirPath)
  const parseData = async () => ({
    ...(
      await parseFromJsonFile(
        withSrcDir,
        ifPathExists,
        readFile,
        parseJson,
      )
    ),
    ...parseFromEnv(process.env),
  })

  return Promise.all([
    renderIndex(
      withSrcDir,
      withBuildDir,
      readFile,
      writeFile,
      parseData,
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
