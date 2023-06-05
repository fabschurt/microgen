import { join } from 'node:path'

const DATA_FILE_NAME = 'data.json'
const INDEX_TEMPLATE_NAME = 'index.pug'
const INDEX_OUTPUT_NAME = 'index.html'
const CSS_FILE_NAME = 'style.css'

export function renderIndex(
  withSrcDir,
  withBuildDir,
  readFile,
  writeFile,
  ifExists,
  parseJson,
  renderTemplate,
) {
  return withSrcDir((prefixWithSrcPath) => {
    return withBuildDir(async (prefixWithBuildPath) => {
      const jsonDataPath = prefixWithSrcPath(DATA_FILE_NAME)
      const data = await ifExists(
        jsonDataPath,
        async (path) => parseJson(await readFile(path)),
        {},
      )

      const renderedTemplate = renderTemplate(
        await readFile(prefixWithSrcPath(INDEX_TEMPLATE_NAME)),
        data,
      )

      return writeFile(
        prefixWithBuildPath(INDEX_OUTPUT_NAME),
        renderedTemplate,
      )
    })
  })
}

export function copyCssFile(
  withSrcDir,
  withBuildDir,
  copyFile,
  ifExists,
) {
  return withSrcDir((prefixWithSrcPath) => {
    return withBuildDir((prefixWithBuildPath) => {
      const cssFileSrcPath = prefixWithSrcPath(CSS_FILE_NAME)

      return ifExists(
        cssFileSrcPath,
        (path) => copyFile(path, prefixWithBuildPath(CSS_FILE_NAME)),
      )
    })
  })
}
