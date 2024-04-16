import assert from 'node:assert'

export const translateString = (
  (IntlMessageFormat, dictionary, defaultLocale = 'en') => (
    (msgID, params = {}, locale = defaultLocale) => {
      assert(
        msgID in dictionary,
        `The messsage with ID \`${msgID}\` does not exist in the dictionary.`,
      )

      return new IntlMessageFormat(dictionary[msgID], locale).format(params)
    }
  )
)
