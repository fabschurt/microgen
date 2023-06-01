import * as pug from 'pug'

const PUG_TEMPLATE_FILE_EXT = '.pug'

export default function createPugRenderer(prefixPathWithPugDir) {
  return function renderTemplate(templateName) {
    return pug.renderFile(
      prefixPathWithPugDir(templateName) + PUG_TEMPLATE_FILE_EXT,
    )
  }
}
