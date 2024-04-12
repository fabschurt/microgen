const DATA_FILE_PATH = 'data.json'
const ENV_VAR_PLACEHOLDER_PATTERN = /^%(.+)%$/

const captureEnvVarName = (value) => {
  const match = value.match?.(ENV_VAR_PLACEHOLDER_PATTERN)

  return match ? match[1] : null
}

export const parseProjectData = (parseJSONFile, withSrcDir) => (
  withSrcDir((prefixWithSrcDir) => parseJSONFile(prefixWithSrcDir(DATA_FILE_PATH)))
)

export const mergeDataWithEnvVars = (
  (deepCloneObject, transformObjectValues) => (
    (data, envVars) => (
      transformObjectValues(
        deepCloneObject(data),
        (obj, key) => {
          const envVarName = captureEnvVarName(obj[key])

          if (envVarName) {
            obj[key] = envVars[envVarName] ?? null
          }
        },
      )
    )
  )
)
