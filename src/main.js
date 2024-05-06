import { parseProjectData, mergeDataWithEnvVars } from '#src/domain/data'
import { parseProjectTranslations } from '#src/domain/i18n'
import { importCustomHelpers } from '#src/domain/helpers'
import { renderProjectIndex, copyProjectAssetsDir } from '#src/domain/assets'
import { parseJSONFile } from '#src/utils/json'
import {
  withDir,
  withScratchDir,
  ifPathExists,
  readFile,
  writeFile,
  copyDir,
  rmDir,
} from '#src/utils/fs'
import {
  deepCloneObject,
  transformObjectValues,
  cleanUpObjectList,
  mergeObjectList,
  accessObjectProp,
  dotFlattenObject,
} from '#src/utils/object'
import { renderTemplate } from '#src/adapter/pug'
import { translateString } from '#src/adapter/icu'
import { render as renderPug } from 'pug'
import { IntlMessageFormat } from 'intl-messageformat'

export default async function main(
  srcDirPath,
  buildDirPath,
  lang = null,
  envVars = {},
) {
  await ifPathExists(buildDirPath, rmDir)

  const [withSrcDir, withBuildDir] = await Promise.all([
    withDir(srcDirPath),
    withScratchDir(buildDirPath),
  ])
  const _parseJSONFile = parseJSONFile(ifPathExists, readFile)

  return (
    Promise.all([
      parseProjectData(_parseJSONFile, withSrcDir)
        .then(
          (data) => mergeDataWithEnvVars(
            deepCloneObject,
            transformObjectValues,
          )(data, envVars)
        )
      ,
      lang
        ? (
          parseProjectTranslations(_parseJSONFile, withSrcDir, dotFlattenObject)(lang)
            .then((dictionary) => ({
              _: {
                locale: lang,
                t: translateString(IntlMessageFormat, dictionary, lang),
              },
            }))
        )
        : {}
      ,
      importCustomHelpers(withSrcDir, ifPathExists)
        .then((helpers) => ({ _: Object.assign({}, helpers) }))
      ,
    ])
      .then(cleanUpObjectList)
      .then(mergeObjectList)
      .then((data) => (
        Promise.all([
          renderProjectIndex(
            withSrcDir,
            withBuildDir,
            writeFile,
            renderTemplate(renderPug, readFile),
          )(data),
          copyProjectAssetsDir(
            withSrcDir,
            withBuildDir,
            copyDir,
            ifPathExists,
          ),
        ])
      ))
  )
}
