import { render } from 'pug'

export default function renderTemplate(templateStream, data) {
  return render(templateStream, {
    ...data,
    self: true,
  })
}
