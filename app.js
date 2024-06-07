const express= require('express');
const app = express()

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.listen(3007, () => {
	console.log('http://127.0.0.1.3007')
})