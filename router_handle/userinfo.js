const db = require('../db/index.js')
// 导入bcrypt加密中间件
const bcrypt = require('bcryptjs')
//导入node.js的c'rypto库生成uuid
const crypto = require('crypto')
//导入fs处理文件
fs = require('fs')

// 注意：这里没有做路径的防重复处理
// 上传头像
exports.uploadAvatar = (req, res) => {
	// 生成唯一标识
	const onlyId = crypto.randomUUID()
	let oldName = req.files[0].filename;
	let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf8')
	fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
	const sql = 'insert into image set ?'
	db.query(sql, {
		image_url: `http://127.0.0.1:3007/upload/${newName}`,
		onlyId
	}, (err, result) => {
		if (err) return res.cc(err)
		res.send({
			onlyId,
			status: 0,
			url: 'http://127.0.0.1:3007/upload/' + newName
		})
	})
}
// 绑定账号 onlyid account url
exports.bindAccount = (req, res) => {
	const {
		account,
		onlyId,
		url
	} = req.body
	const sql = 'update image set account = ? where onlyId = ?'
	db.query(sql, [account, onlyId], (err, result) => {
		if (err) return res.cc(err)
		if (result.affectedRows == 1) {
			const sql1 = 'update users set image_url = ? where account = ?'
			db.query(sql1, [url, account], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '修改成功'
				})
			})
		}
	})
}

// 修改用户密码 先输入旧密码 oldPassword 新密码 newPassword id 
exports.changePassword = (req, res) => {
	const sql = 'select password from users where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		// bcrypt
		const compareResult = bcrypt.compareSync(req.body.oldPassword, result[0].password)
		if (!compareResult) {
			return res.send({
				status: 1,
				message: '原密码错误'
			})
		}
		req.body.newPassword = bcrypt.hashSync(req.body.newPassword, 10)
		const sql1 = 'update users set password = ? where id = ?'
		db.query(sql1, [req.body.newPassword, req.body.id], (err, result) => {
			if (err) return res.cc(err)
			res.send({
				status: 0,
				message: '修改成功'
			})
		})
	})
}


// 获取用户信息 接收参数 id
exports.getUserInfo = (req, res) => {
	const sql = 'select * from users where id = ?'
	db.query(sql, req.body.id, (err, result) => {
		if (err) return res.cc(err)
		result[0].password = ''
		res.send(result[0])
	})
}

// 修改姓名 接收参数 id name
exports.changeName = (req, res) => {
	const{id,name} = req.body
	const sql = 'update users set name = ? where id = ?'
	db.query(sql, [name,id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改成功'
		})
	})
}
// 修改性别 接收参数 id sex
exports.changeSex = (req, res) => {
	const {
		id,
		sex
	} = req.body
	const sql = 'update users set sex = ? where id = ?'
	db.query(sql, [sex, id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改成功'
		})
	})
}
// 修改邮箱 接收参数 id email
exports.changeEmail = (req, res) => {
	const {
		id,
		email
	} = req.body
	const sql = 'update users set email = ? where id = ?'
	db.query(sql, [email, id], (err, result) => {
		if (err) return res.cc(err)
		res.send({
			status: 0,
			message: '修改成功'
		})
	})
}
