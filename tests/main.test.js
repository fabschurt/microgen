import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import microgen from '#src/main'

describe('#src/main', () => {
  describe('main()', () => {
    it('generates a single-page website from a source bundle', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const srcDirPath = prefixWithTempDir('src')
        const buildDirPath = prefixWithTempDir('dist')

        const transDirPath = join(srcDirPath, 'i18n')
        const assetsDirBasePath = 'assets'
        const cssDirBasePath = join(assetsDirBasePath, 'css')

        const dataFilePath = join(srcDirPath, 'data.json')
        const transFilePath = join(transDirPath, 'en.json')
        const indexTemplatePath = join(srcDirPath, 'index.pug')
        const indexOutputPath = join(buildDirPath, 'index.html')
        const mainJSFileBasePath = join(assetsDirBasePath, 'app.js')
        const mainCSSFileBasePath = join(cssDirBasePath, 'main.css')

        const mainJSFileContent = "alert('Hello world!')"
        const mainCSSFileContent = 'body { background-color: antiquewhite; }'

        await fs.mkdir(srcDirPath)
        await fs.mkdir(transDirPath)
        await fs.mkdir(join(srcDirPath, assetsDirBasePath))
        await fs.mkdir(join(srcDirPath, cssDirBasePath))

        await fs.writeFile(dataFilePath, `
{
  "id": {
    "first_name": "John",
    "last_name": "Smith",
    "age": 35,
    "city": "%SECRET_CITY%"
  }
}
`)
        await fs.writeFile(transFilePath, `
{
  "greetings": "Hello",
  "full_name": "%s %s",
  "occupation": {
    "dev": "developer",
    "fireman": "firefighter"
  }
}
`)
        await fs.writeFile(indexTemplatePath, `
doctype html
html
  head
    title Some meaningless title
  body
    p #{_.trans('greetings')}! I’m #{_.trans('full_name', id.first_name, id.last_name)}, I’m #{id.age} years old, and I live in #{id.city}.
    p I work as a #{_.trans('occupation.dev')}, but I’ve always dreamt about being a #{_.trans('occupation.fireman')}.
`)
        await fs.writeFile(join(srcDirPath, mainJSFileBasePath), mainJSFileContent)
        await fs.writeFile(join(srcDirPath, mainCSSFileBasePath), mainCSSFileContent)

        await microgen(
          srcDirPath,
          buildDirPath,
          'en',
          {
            SECRET_CITY: 'New York City',
          },
        )

        assert.strictEqual(
          await fs.readFile(indexOutputPath, { encoding: 'utf8' }),
          '<!DOCTYPE html>' +
          '<html>' +
            '<head>' +
              '<title>Some meaningless title</title>' +
            '</head>' +
            '<body>' +
              '<p>Hello! I’m John Smith, I’m 35 years old, and I live in New York City.</p>' +
              '<p>I work as a developer, but I’ve always dreamt about being a firefighter.</p>' +
            '</body>' +
          '</html>',
        )
        assert.strictEqual(
          await fs.readFile(join(buildDirPath, mainJSFileBasePath), { encoding: 'utf8' }),
          mainJSFileContent,
        )
        assert.strictEqual(
          await fs.readFile(join(buildDirPath, mainCSSFileBasePath), { encoding: 'utf8' }),
          mainCSSFileContent,
        )
      })
    })
  })
})
