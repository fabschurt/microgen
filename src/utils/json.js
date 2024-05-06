export const parseJSONFile = (
  (ifPathExists, readFile) => (
    (jsonFilePath) => (
      ifPathExists(
        jsonFilePath,
        (filePath) => readFile(filePath).then(JSON.parse),
        {},
      )
    )
  )
)
