import { parseProjectData, mergeDataWithEnvVars } from '#src/domain/data'
import { parseProjectTranslations } from '#src/domain/i18n'
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
} from '#src/utils/object'
import renderTemplate from '#src/adapter/renderTemplate/pug'
import { format } from 'node:util'
import { render as renderPug } from 'pug'

function parseData(parseJSONFile, withSrcDir, lang = null, envVars = []) {
  return Promise.all([
    parseProjectData(parseJSONFile, withSrcDir)
      .then((data) => mergeDataWithEnvVars(
        deepCloneObject,
        transformObjectValues,
        data,
        envVars,
      ))
    ,
    lang
      ? (
        parseProjectTranslations(parseJSONFile, withSrcDir, lang)
          .then((dictionary) => ({
            _: {
              trans: (transKey, ...args) => (
                format(
                  accessObjectProp(dictionary, transKey),
                  ...args,
                )
              )
            },
          }))
      ) : {}
    ,
  ])
    .then(cleanUpObjectList)
    .then(mergeObjectList)
}

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

  return (
    parseData(
      (filePath) => parseJSONFile(ifPathExists, readFile, filePath),
      withSrcDir,
      lang,
      envVars,
    )
      .then((data) => (
        Promise.all([
          renderProjectIndex(
            withSrcDir,
            withBuildDir,
            writeFile,
            (templateBasePath, data) => renderTemplate(renderPug, readFile, templateBasePath, data),
            data,
          ),
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
