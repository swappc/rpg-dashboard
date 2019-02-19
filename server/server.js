const express = require('express')
const app = express()
const port = 3000

app.get('/', (request, response) => {
  response.redirect("http://127.0.0.1:3000/index.html")
})

app.use(express.static("../public"))


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

