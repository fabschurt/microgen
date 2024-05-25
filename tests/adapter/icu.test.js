import { describe, it } from 'node:test'
import assert from 'node:assert'
import { translateString } from '#src/adapter/icu'
import { IntlMessageFormat } from 'intl-messageformat'

describe('#src/adapter/icu', () => {
  describe('translateString()', () => {
    it('translates an ICU-formatted string using a static dictionary', () => {
      const dictionary = {
        greetings: 'Hello, my name is {name}.',
        occupation: 'I’m a {job}, the best in {town}.',
        number_of_kids: 'I have {kidNum, plural, =0 {no kids} =1 {a single child} other {# kids}}.',
        bastille_day: 'France’s Bastille Day was on {bastilleDay, date, ::yyyyMMMMdd}.',
        account_balance: 'I have {balance, number} moneyz on my bank account.',
      }

      const trans = translateString(IntlMessageFormat, dictionary)

      it('supports param placeholders', () => {
        assert.strictEqual(
          trans('greetings', { name: 'John Smith' }),
          'Hello, my name is John Smith.',
        )
        assert.strictEqual(
          trans('occupation', { job: 'smith', town: 'Smithtown' }),
          'I’m a smith, the best in Smithtown.',
        )
      })

      it('supports plural form', () => {
        assert.strictEqual(
          trans('number_of_kids', { kidNum: 0 }),
          'I have no kids.',
        )
        assert.strictEqual(
          trans('number_of_kids', { kidNum: 1 }),
          'I have a single child.',
        )
        assert.strictEqual(
          trans('number_of_kids', { kidNum: 2 }),
          'I have 2 kids.',
        )
      })

      it('supports locale-specific date formatting', () => {
        const bastilleDay = new Date('1789-07-14')

        assert.strictEqual(
          trans('bastille_day', { bastilleDay }, 'en-US'),
          'France’s Bastille Day was on July 14, 1789.',
        )
        assert.strictEqual(
          trans('bastille_day', { bastilleDay }, 'fr-FR'),
          'France’s Bastille Day was on 14 juillet 1789.',
        )
      })

      it('supports locale-specific number formatting', () => {
        const balance = 12345.67

        assert.strictEqual(
          trans('account_balance', { balance }, 'en-US'),
          'I have 12,345.67 moneyz on my bank account.',
        )
        assert.strictEqual(
          trans('account_balance', { balance }, 'fr-FR'),
          'I have 12 345,67 moneyz on my bank account.',
        )
      })

      it('throws if the message ID does not exist in the dictionary', () => {
        assert.throws(
          () => trans('askdjww00--'),
          RangeError,
        )
      })
    })
  })
})
