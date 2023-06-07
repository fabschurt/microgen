import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir, generateNonExistentPath, noop } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import {
  withDir,
  withScratchDir,
  ifPathExists,
  readFile,
  writeFile,
} from '#src/utils/fs'

describe('utils/fs', () => {
  describe('withDir()', () => {
    it('executes a callback that will be passed a dir-path prefixer', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('some-dir')
        const fileName = 'hello.txt'

        await fs.mkdir(dirPath)

        await withDir(dirPath)(async (prefixWithDir) => {
          await fs.writeFile(
            prefixWithDir(fileName),
            'Hello fren!',
          )
        })

        assert.doesNotReject(fs.access(join(dirPath, fileName)))
      })
    })

    it('throws if the target directory is not accessible', () => {
      assert.rejects(withDir(generateNonExistentPath())(noop))
    })
  })

  describe('withScratchDir()', () => {
    it('creates a writable scratch directory if it does not exist', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('dist')
        const fileName = 'test.txt'

        await withScratchDir(dirPath)(async (prefixWithDir) => {
          await fs.writeFile(
            prefixWithDir(fileName),
            'All your base are belong to us.',
          )
        })

        assert.doesNotReject(fs.access(dirPath))
        assert.doesNotReject(fs.access(join(dirPath, fileName)))
      })
    })

    it('opens the directory normally if it already exists', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('build')
        const fileName = 'doge.py'

        await fs.mkdir(dirPath)

        await withScratchDir(dirPath)(async (prefixWithDir) => {
          await fs.writeFile(
            prefixWithDir(fileName),
            'print(\'Wow, such fren, very noyce.\')',
          )
        })

        assert.doesNotReject(fs.access(join(dirPath, fileName)))
      })
    })

    it('throws if the target directory is not writable', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('locked-dir')

        await fs.mkdir(dirPath, { mode: 0o555 })

        assert.rejects(withScratchDir(dirPath)(noop))
      })
    })
  })

  describe('ifPathExists()', () => {
    it('executes a callback only if the target path exists', async () => {
      const nonExistentPath = generateNonExistentPath()
      let marker = 0

      await ifPathExists('/', () => marker = 1)
      await ifPathExists(nonExistentPath, () => marker = 2)

      assert.strictEqual(marker, 1)
    })

    it('has a configurable default return value', async () => {
      const nonExistentPath = generateNonExistentPath()

      assert.strictEqual(
        await ifPathExists(nonExistentPath, noop),
        false,
      )

      assert.deepStrictEqual(
        await ifPathExists(nonExistentPath, noop, ['wow', 'such', 'fail']),
        ['wow', 'such', 'fail'],
      )
    })
  })

  describe('readFile()', () => {
    it('reads a file', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const filePath = prefixWithTempDir('dog.rb')
        const fileContent = 'puts \'Yes, this is dog!\''

        await fs.writeFile(filePath, fileContent)

        assert.strictEqual(await readFile(filePath), fileContent)
      })
    })
  })

  describe('writeFile()', () => {
    it('writes a file', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const filePath = prefixWithTempDir('forever_alone.txt')
        const fileContent = 'Oh god why…'

        await writeFile(filePath, fileContent)

        assert.strictEqual(
          await fs.readFile(filePath, { encoding: 'utf8' }),
          fileContent,
        )
      })
    })
  })
})
