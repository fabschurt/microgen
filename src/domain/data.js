const DATA_FILE_PATH = 'data.json'
const ENV_VAR_PLACEHOLDER_PATTERN = /^%(.+)%$/

function captureEnvVarName(value) {
  const match = value.match?.(ENV_VAR_PLACEHOLDER_PATTERN)

  return match ? match[1] : null
}

export function parseProjectData(parseJSONFile, withSrcDir) {
  return withSrcDir((prefixWithSrcDir) => parseJSONFile(prefixWithSrcDir(DATA_FILE_PATH)))
}

export function mergeDataWithEnvVars(
  deepCloneObject,
  transformObjectValues,
  data,
  envVars,
) {
  return transformObjectValues(
    deepCloneObject(data),
    (obj, key) => {
      const envVarName = captureEnvVarName(obj[key])

      if (envVarName) {
        obj[key] = envVars[envVarName] ?? null
      }
    }
  )
}
