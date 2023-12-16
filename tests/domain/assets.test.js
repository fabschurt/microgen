import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import { withDir, writeFile, copyDir, ifPathExists } from '#src/utils/fs'
import { renderProjectIndex, copyProjectAssetsDir } from '#src/domain/assets'

describe('#src/domain/assets', () => {
  describe('renderProjectIndex()', () => {
    it('renders the project’s HTML index', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const buildDirPath = prefixWithTempDir('build')
        const indexTemplatePath = join(srcDirPath, 'index.tpl')
        const indexOutputPath = join(buildDirPath, 'index.html')

        await fs.mkdir(srcDirPath)
        await fs.mkdir(buildDirPath)
        await fs.writeFile(indexTemplatePath, '%PHRASE%!')

        const renderTemplate = async (templatePath, data) => {
          const template = await fs.readFile(
            `${templatePath}.tpl`,
            { encoding: 'utf8' },
          )

          return template.replace(
            '%PHRASE%',
            `Hello ${data.firstName} ${data.lastName}`,
          )
        }

        await renderProjectIndex(
          withDir(srcDirPath),
          withDir(buildDirPath),
          writeFile,
          renderTemplate,
          {
            firstName: 'John',
            lastName: 'Doe',
          },
        )

        assert.strictEqual(
          await fs.readFile(indexOutputPath, { encoding: 'utf8' }),
          'Hello John Doe!',
        )
      })
    })
  })

  describe('copyProjectAssetsDir', () => {
    it('copies the assets directory into the build directory verbatim', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const buildDirPath = prefixWithTempDir('build')
        const assetsDirPath = join(buildDirPath, 'assets')
        const cssDirPath = join(assetsDirPath, 'css')
        const file1Path = join(assetsDirPath, 'main.js')
        const file2Path = join(cssDirPath, 'app.css')
        const file1Content = "alert('All your base are belong to us!')"
        const file2Content = '* { display: none; }'

        await fs.mkdir(srcDirPath)
        await fs.mkdir(buildDirPath)
        await fs.mkdir(assetsDirPath)
        await fs.mkdir(cssDirPath)
        await fs.writeFile(file1Path, file1Content)
        await fs.writeFile(file2Path, file2Content)

        await copyProjectAssetsDir(
          withDir(srcDirPath),
          withDir(buildDirPath),
          copyDir,
          ifPathExists,
        )

        assert.strictEqual(
          await fs.readFile(file1Path, { encoding: 'utf8' }),
          file1Content,
        )
        assert.strictEqual(
          await fs.readFile(file2Path, { encoding: 'utf8' }),
          file2Content,
        )
      })
    })
  })
})
