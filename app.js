// 导入express框架
const express = require('express')
// 创建express实例
const app = express()
// const path = require('path');
// 导入body-parser
var bodyParser = require('body-parser')

// 导入cors
const cors = require('cors')
// 全局挂载
app.use(cors())

// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
const multer = require("multer");
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片
const upload = multer({
	dest: './public/upload'
})
app.use(upload.any())
// 静态托管
// app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static("./public"));

app.use(bodyParser.urlencoded({
	extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
	// status=0为成功,=1为失败,默认设为1,方便处理失败的情况
	res.cc = (err, status = 1) => {
		res.send({
			status,
			// 判断这个error是错误对象还是字符串
			message: err instanceof Error ? err.message : err,
		})
	}
	next()
})

const jwtconfig = require('./jwt_config/index.js')
// const {
// 	expressjwt: jwt
// } = require('express-jwt')
// app.use(jwt({
// 	secret:jwtconfig.jwtSecretKey,algorithms:['HS256']
// }).unless({
// 	path:[/^\/api\//]
// }))

const loginRouter = require('./router/login')
const Joi = require('joi')
app.use('/api', loginRouter)

const userRouter = require('./router/userinfo.js')
app.use('/user', userRouter)

app.use((err,req, res, next) => {
	if (err instanceof Joi.ValidationError){
		res.send({
			status: 1,
			message:'输入的数据不符合验证规则'
		})
	}
})

app.listen(3007, () => {
	console.log('http://127.0.0.1:3007')
})
