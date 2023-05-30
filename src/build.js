const
  INDEX_TEMPLATE_NAME = 'index',
  INDEX_OUTPUT_NAME = 'index.html',
  CSS_FILE_NAME = 'style.css'

function renderIndex(
  prefixPathWithSrcDir,
  prefixPathWithBuildDir,
  renderTemplate,
  writeToFile,
) {
  writeToFile(
    prefixPathWithBuildDir(INDEX_OUTPUT_NAME),
    renderTemplate(INDEX_TEMPLATE_NAME),
  )
}

function copyStyleFile(prefixPathWithSrcDir, prefixPathWithBuildDir, copyFile) {
  copyFile(
    prefixPathWithSrcDir(CSS_FILE_NAME),
    prefixPathWithBuildDir(CSS_FILE_NAME),
  )
}

export default function buildProject(
  prefixPathWithSrcDir,
  prefixPathWithBuildDir,
  renderTemplate,
  copyFile,
  writeToFile,
) {
  renderIndex(prefixPathWithSrcDir, prefixPathWithBuildDir, renderTemplate, writeToFile)
  copyStyleFile(prefixPathWithSrcDir, prefixPathWithBuildDir, copyFile)
}
