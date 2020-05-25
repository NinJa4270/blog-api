const Jwt = require('jsonwebtoken');
const config = require('../config')

function tokenVerify(token) {
    try {
        Jwt.verify(token, config.token.secretOrPublicKey)
        return true;
    } catch (err) {
        return false
    }

}

module.exports = {
    isVaildToken(req, res, next) {
        let bearerToken = req.headers.authorization
        try {
            let token = bearerToken.split(' ')[1]
            if (tokenVerify(token)) {       
                next()
            } else {
                res.status(403).send({
                    code: 403,
                    message: '登录凭证校验失败,请重新登录'
                })
            }
        } catch(error) {
            res.status(401).send({
                code: 401,
                message: '请登陆后再发起请求'
            })
        }
    }
}