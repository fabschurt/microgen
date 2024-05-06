const HELPER_FILE_PATH = 'helpers.mjs'

export const importCustomHelpers = (withSrcDir, ifPathExists) => (
  withSrcDir((prefixWithSrcDir) => (
    ifPathExists(
      prefixWithSrcDir(HELPER_FILE_PATH),
      (filePath) => import(filePath),
      {},
    )
  ))
)
