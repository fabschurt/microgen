import { describe, it } from 'node:test'
import assert from 'node:assert'
import { parseJson } from '#src/utils/json'

describe('#src/utils/json', () => {
  describe('parseJson()', () => {
    it('parses an input stream as JSON', () => {
      assert.deepStrictEqual(
        parseJson('{"person": {"name": "Jamez", "surname": "Bong"}}'),
        {
          person: {
            name: 'Jamez',
            surname: 'Bong',
          },
        },
      )
    })
  })
})
