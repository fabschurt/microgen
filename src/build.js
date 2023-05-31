const
  INDEX_TEMPLATE_NAME = 'index',
  INDEX_OUTPUT_NAME = 'index.html',
  CSS_FILE_NAME = 'style.css'

function renderIndex(prefixPathWithBuildDir, renderTemplate, writeToFile) {
  return writeToFile(
    prefixPathWithBuildDir(INDEX_OUTPUT_NAME),
    renderTemplate(INDEX_TEMPLATE_NAME),
  )
}

function copyStyleFile(prefixPathWithSrcDir, prefixPathWithBuildDir, copyFile) {
  return copyFile(
    prefixPathWithSrcDir(CSS_FILE_NAME),
    prefixPathWithBuildDir(CSS_FILE_NAME),
  )
}

export default function buildMicroSite(
  prefixPathWithSrcDir,
  prefixPathWithBuildDir,
  renderTemplate,
  copyFile,
  writeToFile,
) {
  return Promise.all([
    renderIndex(prefixPathWithBuildDir, renderTemplate, writeToFile),
    copyStyleFile(prefixPathWithSrcDir, prefixPathWithBuildDir, copyFile),
  ])
}
