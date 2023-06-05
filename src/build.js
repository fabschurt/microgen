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
  return withSrcDir((srcDirPath) => {
    return withBuildDir(async (buildDirPath) => {
      const jsonDataPath = join(srcDirPath, DATA_FILE_NAME)
      const data = await ifExists(
        jsonDataPath,
        async (path) => parseJson(await readFile(path)),
        {},
      )

      const renderedTemplate = renderTemplate(
        await readFile(join(srcDirPath, INDEX_TEMPLATE_NAME)),
        data,
      )

      return writeFile(
        join(buildDirPath, INDEX_OUTPUT_NAME),
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
  return withSrcDir((srcDirPath) => {
    return withBuildDir((buildDirPath) => {
      const cssFileSrcPath = join(srcDirPath, CSS_FILE_NAME)

      return ifExists(
        cssFileSrcPath,
        (path) => copyFile(path, join(buildDirPath, CSS_FILE_NAME)),
      )
    })
  })
}
