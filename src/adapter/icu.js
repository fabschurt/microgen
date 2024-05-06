export const translateString = (
  (IntlMessageFormat, dictionary, defaultLocale = 'en') => (
    (msgID, params = {}, locale = defaultLocale) => {
      if (!(msgID in dictionary)) {
        throw new RangeError(`The messsage with ID \`${msgID}\` does not exist in the dictionary.`)
      }

      return new IntlMessageFormat(dictionary[msgID], locale).format(params)
    }
  )
)
