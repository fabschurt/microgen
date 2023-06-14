import { describe, it } from 'node:test'
import assert from 'node:assert'
import renderTemplate from '#src/renderTemplate/pug'

describe('#src/renderTemplate/pug', () => {
  describe('renderTemplate()', () => {
    it('should render Pug as HTML', () => {
      assert.strictEqual(
        renderTemplate(
          'doctype html\nhtml\n  body\n    p Hello, #{name} #{surname}.',
          {
            name: 'Gill',
            surname: 'Bates',
          },
        ),
        '<!DOCTYPE html><html><body><p>Hello, Gill Bates.</p></body></html>',
      )
    })
  })
})
