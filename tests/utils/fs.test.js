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
  copyDir,
  rmDir,
} from '#src/utils/fs'

describe('#src/utils/fs', () => {
  describe('withDir()', () => {
    it('executes a callback that will be passed a dir-path prefixer', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('some-dir')
        const fileName = 'hello.txt'

        await fs.mkdir(dirPath)
        await withDir(dirPath)((prefixWithDir) => {
          return fs.writeFile(prefixWithDir(fileName), 'Hello fren!')
        })

        await assert.doesNotReject(fs.access(join(dirPath, fileName)))
      })
    })

    it('throws if the target directory is not accessible', async () => {
      await assert.rejects(withDir(generateNonExistentPath())(noop))
    })
  })

  describe('withScratchDir()', () => {
    it('creates a writable scratch directory if it does not exist', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('dist')
        const fileName = 'test.txt'

        await withScratchDir(dirPath)((prefixWithDir) => {
          return fs.writeFile(prefixWithDir(fileName), 'All your base are belong to us.')
        })

        await assert.doesNotReject(fs.access(dirPath))
        await assert.doesNotReject(fs.access(join(dirPath, fileName)))
      })
    })

    it('opens the directory normally if it already exists', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('build')
        const fileName = 'doge.py'

        await fs.mkdir(dirPath)
        await withScratchDir(dirPath)((prefixWithDir) => {
          return fs.writeFile(prefixWithDir(fileName), 'print(\'Wow, such fren, very noyce.\')')
        })

        await assert.doesNotReject(fs.access(join(dirPath, fileName)))
      })
    })

    it('throws if the target directory is not writable', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('locked-dir')

        await fs.mkdir(dirPath, { mode: 0o555 })

        await assert.rejects(withScratchDir(dirPath)(noop))
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
        await ifPathExists(nonExistentPath, noop, 'Wow, such fail, very bad.'),
        'Wow, such fail, very bad.',
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

  describe('copyDir()', () => {
    it('recursively copies a directory', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const nestedDirPath = join(srcDirPath, 'nested/dir')
        const file1Path = join(srcDirPath, 'test.css')
        const file2Path = join(nestedDirPath, 'test.json')
        const file1Content = 'html { display: none; }'
        const file2Content = '{ "foo": "bar" }'

        await fs.mkdir(nestedDirPath, { recursive: true })
        await fs.writeFile(file1Path, file1Content)
        await fs.writeFile(file2Path, file2Content)

        const destDirPath = prefixWithTempDir('build')

        await copyDir(srcDirPath, destDirPath)

        assert.strictEqual(
          await fs.readFile(join(destDirPath, 'test.css'), { encoding: 'utf8' }),
          file1Content,
        )
        assert.strictEqual(
          await fs.readFile(join(destDirPath, 'nested/dir/test.json'), { encoding: 'utf8' }),
          file2Content,
        )
      })
    })

    it('throws if some destination files already exist', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const destDirPath = prefixWithTempDir('dist')

        await fs.mkdir(srcDirPath)
        await fs.mkdir(destDirPath)
        await fs.writeFile(join(srcDirPath, 'test.txt'), 'All your base are belong to us.')
        await fs.writeFile(join(destDirPath, 'test.txt'), 'Whatever…')

        await assert.rejects(copyDir(srcDirPath, destDirPath))
      })
    })
  })

  describe('rmDir()', () => {
    it('recursively removes a directory', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const dirPath = prefixWithTempDir('build')
        const filePath = join(dirPath, 'test.txt')

        await fs.mkdir(dirPath)
        await fs.writeFile(filePath, 'Don’t mind me, I’m going away.')
        await rmDir(dirPath)

        await assert.rejects(fs.access(filePath))
        await assert.rejects(fs.access(dirPath))
      })
    })
  })
})
