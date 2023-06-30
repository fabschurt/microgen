const JSON_FILE_NAME = 'data.json'
const ENV_VAR_PREFIX = '_MG_'

function normalizeEnvVarName(str) {
  return (
    str
      .toLowerCase()
      .substring(ENV_VAR_PREFIX.length)
  )
}

export function parseDataFromJsonFile(withSrcDir, ifPathExists, readFile, parseJson) {
  return withSrcDir((prefixWithSrcDir) => {
    const jsonFilePath = prefixWithSrcDir(JSON_FILE_NAME)

    return ifPathExists(
      jsonFilePath,
      async () => parseJson(await readFile(jsonFilePath)),
      {},
    )
  })
}

/**
 * Extracts env vars whose name starts with `ENV_VAR_PREFIX`, converts this name
 * to snake case, and returns a normalized dictionary of these extracted vars.
 */
export function parseDataFromEnv(envObject) {
  return (
    Object.fromEntries(
      Object.entries(envObject)
        .filter(([key, val]) => key.startsWith(ENV_VAR_PREFIX))
        .map(([key, val]) => [normalizeEnvVarName(key), val])
    )
  )
}
