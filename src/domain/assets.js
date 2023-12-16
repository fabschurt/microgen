const INDEX_TEMPLATE_BASENAME = 'index'
const INDEX_OUTPUT_NAME = 'index.html'
const ASSETS_DIR_NAME = 'assets'

export function renderProjectIndex(
  withSrcDir,
  withBuildDir,
  writeFile,
  renderTemplate,
  data,
) {
  return withSrcDir((prefixWithSrcDir) => {
    return withBuildDir(async (prefixWithBuildDir) => {
      return writeFile(
        prefixWithBuildDir(INDEX_OUTPUT_NAME),
        await renderTemplate(
          prefixWithSrcDir(INDEX_TEMPLATE_BASENAME),
          data,
        ),
      )
    })
  })
}

export function copyProjectAssetsDir(
  withSrcDir,
  withBuildDir,
  copyDir,
  ifPathExists,
) {
  return withSrcDir((prefixWithSrcDir) => {
    return withBuildDir((prefixWithBuildDir) => {
      return ifPathExists(
        prefixWithSrcDir(ASSETS_DIR_NAME),
        (dirPath) => copyDir(dirPath, prefixWithBuildDir(ASSETS_DIR_NAME)),
      )
    })
  })
}
