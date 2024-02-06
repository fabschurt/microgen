const TEMPLATE_EXT = '.pug'

export default function renderTemplate(
  renderPug,
  readFile,
  templateBasePath,
  data,
) {
  return (
    readFile(templateBasePath + TEMPLATE_EXT)
      .then((template) => renderPug(template, data))
  )
}
