import { describe, it } from 'node:test'
import assert from 'node:assert'
import renderTemplate from '#src/renderTemplate/pug'

describe('#src/renderTemplate/pug', () => {
  describe('renderTemplate()', () => {
    it('should render Pug as HTML', () => {
      const data = {
        name: 'Gill',
        surname: 'Bates',
      }

      assert.strictEqual(
        renderTemplate(
          'doctype html\nhtml\n  body\n    p Hello, #{self.name} #{self.surname}.',
          data,
        ),
        '<!DOCTYPE html><html><body><p>Hello, Gill Bates.</p></body></html>',
      )
    })
  })
})
