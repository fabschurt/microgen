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
  renderTemplate,
) {
  return withSrcDir((srcDirPath) => {
    return withBuildDir(async (buildDirPath) => {
      return writeFile(
        join(buildDirPath, INDEX_OUTPUT_NAME),
        renderTemplate(
          await readFile(
            join(srcDirPath, INDEX_TEMPLATE_NAME),
          )
        )
      )
    })
  })
}

export function copyCssFile(withSrcDir, withBuildDir, copyFile) {
  return withSrcDir((srcDirPath) => {
    return withBuildDir((buildDirPath) => {
      return copyFile(
        join(srcDirPath, CSS_FILE_NAME),
        join(buildDirPath, CSS_FILE_NAME),
      )
    })
  })
}
