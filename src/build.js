import { join } from 'node:path'

const INDEX_TEMPLATE_NAME = 'index.pug'
const INDEX_OUTPUT_NAME = 'index.html'
const ASSET_DIR_NAME = 'assets'

export function renderIndex(
  withSrcDir,
  withBuildDir,
  readFile,
  writeFile,
  renderTemplate,
  data,
) {
  return withSrcDir((prefixWithSrcDir) => {
    return withBuildDir(async (prefixWithBuildDir) => {
      const renderedTemplate = renderTemplate(
        await readFile(prefixWithSrcDir(INDEX_TEMPLATE_NAME)),
        data,
      )

      return writeFile(
        prefixWithBuildDir(INDEX_OUTPUT_NAME),
        renderedTemplate,
      )
    })
  })
}

export function copyAssetDir(
  withSrcDir,
  withBuildDir,
  copyDir,
  ifPathExists,
) {
  return withSrcDir((prefixWithSrcDir) => {
    return withBuildDir((prefixWithBuildDir) => {
      const assetDirPath = prefixWithSrcDir(ASSET_DIR_NAME)

      return ifPathExists(
        assetDirPath,
        (path) => copyDir(path, prefixWithBuildDir(ASSET_DIR_NAME)),
      )
    })
  })
}
