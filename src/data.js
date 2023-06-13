const JSON_FILE_NAME = 'data.json'
const ENV_VAR_PREFIX = '_MG_'

function normalizeEnvVarName(str) {
  return (
    str
      .toLowerCase()
      .substring(ENV_VAR_PREFIX.length)
  )
}

export async function parseFromJsonFile(
  withSrcDir,
  ifPathExists,
  readFile,
  parseJson,
) {
  return await withSrcDir(async (prefixWithSrcDir) => {
    const jsonFilePath = prefixWithSrcDir(JSON_FILE_NAME)

    return await ifPathExists(
      jsonFilePath,
      async () => parseJson(await readFile(jsonFilePath)),
      {},
    )
  })
}

export function parseFromEnv(envObject) {
  return (
    Object.fromEntries(
      Object.entries(envObject)
        .filter(([key, val]) => key.startsWith(ENV_VAR_PREFIX))
        .map(([key, val]) => [normalizeEnvVarName(key), val])
    )
  )
}
