import { describe, it } from 'node:test'
import assert from 'node:assert'
import { join as joinPaths } from 'node:path'
import * as fs from 'node:fs'
import { withTempDir } from '#tests/helpers'
import createPugRenderer from '#src/render/pug'

describe('render/pug', () => {
  describe('createPugRenderer()', () => {
    it('should return a Pug-to-HTML renderer', () => {
      withTempDir((tempDirPath) => {
        fs.mkdirSync(joinPaths(tempDirPath, 'pug/pages'), { recursive: true })

        fs.writeFileSync(
          joinPaths(tempDirPath, 'pug/pages/index.pug'),
          'doctype html\nhtml\n  body\n    p Hello world!',
        )

        const renderPugTemplate = createPugRenderer(
          (path) => joinPaths(tempDirPath, 'pug', path),
        )

        assert.strictEqual(
          renderPugTemplate('pages/index'),
          '<!DOCTYPE html><html><body><p>Hello world!</p></body></html>'
        )
      })
    })
  })
})
