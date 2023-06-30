const INDEX_TEMPLATE_NAME = 'index.pug'
const INDEX_OUTPUT_NAME = 'index.html'
const ASSET_DIR_NAME = 'assets'

/**
 * Fetches data from 3 different sources in parallel, filters out empty result
 * sets, and merges everything into a final single object.
 */
export function parseData(
  withSrcDir,
  ifPathExists,
  readFile,
  parseJson,
  parseDataFromJsonFile,
  parseDataFromEnv,
  parseTranslations,
  envVars = [],
  lang = null,
) {
  return Promise.all([
    parseDataFromJsonFile(withSrcDir, ifPathExists, readFile, parseJson),
    parseDataFromEnv(envVars),
    lang
      ? (
        parseTranslations(withSrcDir, ifPathExists, readFile, parseJson, lang)
          .then((dictionary) => ({ __: dictionary }))
      )
      : {}
    ,
  ])
    .then((objects) => objects.filter((obj) => Object.keys(obj).length))
    .then((objects) => Object.assign({}, ...objects))
}

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
      return writeFile(
        prefixWithBuildDir(INDEX_OUTPUT_NAME),
        renderTemplate(
          await readFile(prefixWithSrcDir(INDEX_TEMPLATE_NAME)),
          data,
        ),
      )
    })
  })
}

export function copyAssetDir(withSrcDir, withBuildDir, copyDir, ifPathExists) {
  return withSrcDir((prefixWithSrcDir) => {
    return withBuildDir((prefixWithBuildDir) => {
      return ifPathExists(
        prefixWithSrcDir(ASSET_DIR_NAME),
        (path) => copyDir(path, prefixWithBuildDir(ASSET_DIR_NAME)),
      )
    })
  })
}
