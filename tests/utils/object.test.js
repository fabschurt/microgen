import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  deepCloneObject,
  transformObjectValues,
  cleanUpObjectList,
  mergeObjectList,
} from '#src/utils/object'

describe('#src/utils/object', () => {
  describe('deepCloneObject()', () => {
    it('deep-clones an object', () => {
      const obj = {
        foo: 'bar',
        bar: {
          name: 'John',
          surname: 'Doe',
          interests: [
            'sports',
            'video-games',
            'tabletop-games',
          ],
        },
        stuff: {
          foo: {
            bar: 42,
          },
        },
      }

      const result = deepCloneObject(obj)

      assert.notEqual(result, obj)
      assert.notStrictEqual(result, obj)
      assert.deepStrictEqual(
        result,
        {
          foo: 'bar',
          bar: {
            name: 'John',
            surname: 'Doe',
            interests: [
              'sports',
              'video-games',
              'tabletop-games',
            ],
          },
          stuff: {
            foo: {
              bar: 42,
            },
          },
        },
      )
    })
  })

  describe('transformObjectValues()', () => {
    it('recursively passes each of an object’s nested values trough a callback', () => {
      const obj = {
        foo: 'bar',
        stuff: [
          'foo',
          'bar',
          {
            some_prop: 'a',
            other_prop: 'b',
          },
          'mess',
          'clutter',
        ],
        friend: {
          first_name: 'John',
          last_name: 'Smith',
          spouse: {
            first_name: 'Jane',
            last_name: 'Smith',
          },
        },
      }

      const transformer = (obj, key) => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].toUpperCase()
        }
      }

      assert.deepStrictEqual(
        transformObjectValues(obj, transformer),
        {
          foo: 'BAR',
          stuff: [
            'FOO',
            'BAR',
            {
              some_prop: 'A',
              other_prop: 'B',
            },
            'MESS',
            'CLUTTER',
          ],
          friend: {
            first_name: 'JOHN',
            last_name: 'SMITH',
            spouse: {
              first_name: 'JANE',
              last_name: 'SMITH',
            },
          },
        },
      )
    })
  })

  describe('cleanUpObjectList()', () => {
    it('remove empty objects from an object list', () => {
      const objectList = [
        {},
        {
          foo: 'bar',
          bar: 'foo',
        },
        {},
        {},
        {
          stuff: 'clutter',
        },
      ]

      assert.deepStrictEqual(
        cleanUpObjectList(objectList),
        [
          {
            foo: 'bar',
            bar: 'foo',
          },
          {
            stuff: 'clutter',
          },
        ],
      )
    })
  })

  describe('mergeObjectList()', () => {
    it('shallow-merges objects from a list into a single object', () => {
      const objectList = [
        {
          foo: 'bar',
          bar: 'foo',
        },
        {
          foo: 'crazy',
        },
        {
          identity: {
            name: 'John',
            surname: 'Doe',
          },
        },
      ]

      assert.deepStrictEqual(
        mergeObjectList(objectList),
        {
          foo: 'crazy',
          bar: 'foo',
          identity: {
            name: 'John',
            surname: 'Doe',
          }
        }
      )
    })
  })
})
