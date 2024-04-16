export const parseJSONFile = (
  (ifPathExists, readFile) => (
    (filePath) => (
      ifPathExists(
        filePath,
        () => readFile(filePath).then(JSON.parse),
        {},
      )
    )
  )
)
