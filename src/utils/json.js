function parseJSON(inputStream) {
  return JSON.parse(inputStream)
}

export function parseJSONFile(ifPathExists, readFile, filePath) {
  return ifPathExists(
    filePath,
    async () => parseJSON(await readFile(filePath)),
    {},
  )
}
