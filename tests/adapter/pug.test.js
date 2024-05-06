import { describe, it } from 'node:test'
import assert from 'node:assert'
import { withTempDir } from '#tests/helpers'
import * as fs from 'node:fs/promises'
import { readFile } from '#src/utils/fs'
import { renderTemplate } from '#src/adapter/pug'
import { render as renderPug } from 'pug'

describe('#src/adapter/pug', () => {
  describe('renderTemplate()', () => {
    it('renders a Pug template file as HTML', async () => {
      await withTempDir(async (prefixWithTempDir) => {
        const templateBasePath = prefixWithTempDir('template')
        const templatePath = templateBasePath + '.pug'

        await fs.writeFile(templatePath, `
doctype html
html
  body
    p Hello, #{name} #{surname}.
        `)

        const result = await (
          renderTemplate(renderPug, readFile)(templateBasePath, {
            name: 'Gill',
            surname: 'Bates',
          })
        )

        assert.strictEqual(
          result,
          '<!DOCTYPE html>' +
          '<html>' +
            '<body>' +
              '<p>Hello, Gill Bates.</p>' +
            '</body>' +
          '</html>',
        )
      })
    })
  })
})
