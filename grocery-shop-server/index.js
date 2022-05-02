const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Working Successfully');
})

app.listen(port, () => {
  console.log(`Grocery Shop Running ${port}`)
})