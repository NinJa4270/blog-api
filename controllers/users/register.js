const Con = require('../../database/mysql');
// // 引入时间处理模块
// const moment = require('moment');

// 用户注册
postRegister= async (req,res)=>{   
    let {username,password} = req.body;
    let rishave = await selectRegister(username) ;
    let ishave = JSON.parse(JSON.stringify(rishave))[0].usercount;
    if(ishave === 0){
        // 不存在
        await sqlRegister(username,password);
        res.send({msg:'用户创建成功'});
    }else{
        // 存在
        res.send({msg:'用户名已存在'});
    }
}

// 判断用户名是否存在
let selectRegister = (username)=>{
    let sql = `SELECT COUNT(*) AS usercount FROM blog_user WHERE username = ?`;
    let sqlArr = [username];
    return Con.sySqlConnect(sql,sqlArr); 
}

// 数据库注册
let sqlRegister = (username,password)=>{
    let sql = `INSERT INTO blog_user (username,password) VALUES (?,?)`;
    let sqlArr = [username,password];
    return Con.sySqlConnect(sql,sqlArr); 
}



module.exports = postRegister;
