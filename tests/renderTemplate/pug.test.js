import { describe, it } from 'node:test'
import assert from 'node:assert'
import renderTemplate from '#src/renderTemplate/pug'

describe('renderTemplate/pug', () => {
  describe('renderTemplate()', () => {
    it('should render Pug as HTML', () => {
      assert.strictEqual(
        renderTemplate('doctype html\nhtml\n  body\n    p Hello world!'),
        '<!DOCTYPE html><html><body><p>Hello world!</p></body></html>'
      )
    })
  })
})
