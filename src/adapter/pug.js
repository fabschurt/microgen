const TEMPLATE_EXT = '.pug'

export const renderTemplate = (
  (renderPug, readFile) => (
    (templateBasePath, data) => (
      readFile(templateBasePath + TEMPLATE_EXT)
        .then((template) => renderPug(template, data))
    )
  )
)
