import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  deepCloneObject,
  transformObjectValues,
  cleanUpObjectList,
  mergeObjectList,
  accessObjectProp,
  dotFlattenObject,
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
        foo: 42,
        stuff: [
          'foo',
          Symbol.for('clutter'),
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
          foo: 42,
          stuff: [
            'FOO',
            Symbol.for('clutter'),
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

    it('throws if not passed a composite value', () => {
      assert.throws(
        () => dotFlattenObject(3.14),
        TypeError,
      )
      assert.throws(
        () => dotFlattenObject(Symbol.for('foobar')),
        TypeError,
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
        {},
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
          },
        }
      )
    })
  })

  describe('accessObjectProp', () => {
    it('reads an object’s nested property, whose path is passed as a string', () => {
      const obj = {
        foo: 'yes',
        bar: {
          baz: {
            stuff: 'mess',
          },
          biz: 'buzz',
        },
      }

      assert.strictEqual(accessObjectProp(obj, 'bar.baz.stuff'), 'mess')
    })

    it('throws if the property path is invalid', () => {
      assert.throws(() => accessObjectProp({}, '379&239--'))
    })

    it('throws if one of the nested properties does not exist or is not an object', () => {
      const obj = {
        foo: {
          bar: 'baz',
        },
      }

      assert.throws(
        () => accessObjectProp(obj, 'foo.stuff'),
        RangeError,
      )
      assert.throws(
        () => accessObjectProp(obj, 'foo.bar.stuff'),
        TypeError,
      )
    })
  })

  describe('dotFlattenObject', () => {
    it('flattens an object into key-value pairs', () => {
      const flatObject = dotFlattenObject({
        info: {
          first_name: 'Foo',
          last_name: 'Bar',
        },
        data: {
          secret: {
            password: '1234',
          },
          stuff: [
            'foo',
            'bar',
            'baz',
          ],
        },
      })

      assert.deepStrictEqual(flatObject, {
        'info.first_name': 'Foo',
        'info.last_name': 'Bar',
        'data.secret.password': '1234',
        'data.stuff.0': 'foo',
        'data.stuff.1': 'bar',
        'data.stuff.2': 'baz',
      })
    })

    it('throws if not passed a composite value', () => {
      assert.throws(
        () => dotFlattenObject(42),
        TypeError,
      )
      assert.throws(
        () => dotFlattenObject('Hello!'),
        TypeError,
      )
    })
  })
})
