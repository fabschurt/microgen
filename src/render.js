import * as pug from 'pug'

const PUG_TEMPLATE_FILE_EXT = '.pug'

export default function createPugRenderer(prefixPathWithSrcDir) {
  return function renderPugTemplate(templateName) {
    return pug.renderFile(
      prefixPathWithSrcDir(templateName) + PUG_TEMPLATE_FILE_EXT,
      { pretty: true },
    )
  }
}
