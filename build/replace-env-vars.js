const fs = require('fs')
const files = fs.readdirSync(`${__dirname}/../dist/static/js`)
const {prod, test} = require(`${__dirname}/../config/env-vars`)

for (const file of files) {
  if (!file.startsWith('app.')) continue
  let content =  fs.readFileSync(`${__dirname}/../dist/static/js/${file}`, 'utf8')
  for (const k of Object.keys(test)) {
    content = content.replace(test[k], prod[k])
  }
  fs.writeFileSync(`${__dirname}/../dist/static/js/${file}`, content, 'utf8')
}
