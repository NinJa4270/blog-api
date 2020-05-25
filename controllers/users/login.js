const Con = require('../../database/mysql');
const config = require('../../config');
const Jwt = require('jsonwebtoken');

function tokenSign({
    username,
    password
}) {
    return Jwt.sign({
        username,
        password
    }, config.token.secretOrPublicKey, config.token.options)
}

postLogin = async (req, res) => {
    let {
        username,
        password
    } = req.body;
    let rishave = await selectLogin(username);
    let ishave = JSON.parse(JSON.stringify(rishave))[0].usercount;
    if (ishave === 1) {
        let rmysqlPassword = await compareLogin(username);
        let mysqlPassword = JSON.parse(JSON.stringify(rmysqlPassword))[0].password;
        // 比对密码是否正确
        if (password !== mysqlPassword) {
            return res.status(421).send({
                code: '421',
                msg: '密码错误'
            })
        } else {
            // let rdata = await getLogin(username);
            // let data = JSON.parse(JSON.stringify(rdata))
            res.status(200).send({
                username,
                code: '200',
                msg: '登录成功',
                token: tokenSign(username,password)
            })
        }
    } else {
        res.status(422).send({
            code: '422',
            msg: '用户名不存在'
        })
    }

}

// 寻找用户 

let selectLogin = (username) => {
    let sql = `SELECT COUNT(*) AS usercount FROM blog_user WHERE username = ?`;
    let sqlArr = [username];
    return Con.sySqlConnect(sql, sqlArr);
}

// 比对密码

let compareLogin = (username) => {
    let sql = `SELECT password FROM blog_user WHERE username = ?`;
    let sqlArr = [username];
    return Con.sySqlConnect(sql, sqlArr);
}

// 获取用户信息

// let getLogin = (username)=> {
//     let sql = `SELECT * FROM blog_user WHERE username = ?`;
//     let sqlArr = [username];
//     return Con.sySqlConnect(sql, sqlArr);
// }




module.exports = postLogin;