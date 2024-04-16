const INDEX_TEMPLATE_BASENAME = 'index'
const INDEX_OUTPUT_NAME = 'index.html'
const ASSETS_DIR_NAME = 'assets'

export const renderProjectIndex = (
  (withSrcDir, withBuildDir, writeFile, renderTemplate) => (
    (data) => (
      withSrcDir((prefixWithSrcDir) => (
        withBuildDir(async (prefixWithBuildDir) => (
          writeFile(
            prefixWithBuildDir(INDEX_OUTPUT_NAME),
            await renderTemplate(
              prefixWithSrcDir(INDEX_TEMPLATE_BASENAME),
              data,
            ),
          )
        ))
      ))
    )
  )
)

export const copyProjectAssetsDir = (
  withSrcDir,
  withBuildDir,
  copyDir,
  ifPathExists,
) => (
  withSrcDir((prefixWithSrcDir) => (
    withBuildDir((prefixWithBuildDir) => (
      ifPathExists(
        prefixWithSrcDir(ASSETS_DIR_NAME),
        (dirPath) => copyDir(dirPath, prefixWithBuildDir(ASSETS_DIR_NAME)),
      )
    ))
  ))
)
