const Con = require('../../database/mysql');

// 用户的增删改查

/*
 *
 */
userList = async (req, res) => {
    let rqueryInfo = req.query.query;
    let queryInfo = JSON.parse(rqueryInfo)
    let {
        query,
        pageSize,
        pageNum
    } = queryInfo;
    let start = (pageNum - 1) * pageSize;
    let rdata = await getUserList(query, start, pageSize);
    let data = JSON.parse(JSON.stringify(rdata))
    let rtotal = await getUserListTotal();
    let total = JSON.parse(JSON.stringify(rtotal[0].total));
    res.status(200).send({
        data,
        total,
        code: '200',
        msg: '请求成功',
        pageNum
    })
}

let getUserList = (query, start, pageSize) => {
    if (!query) {
        let sql = `SELECT * FROM blog_user limit` + ' ' + start + ',' + pageSize;
        let sqlArr = [];
        return Con.sySqlConnect(sql, sqlArr);
    } else {
        let sql = `SELECT * FROM blog_user WHERE LOCATE(?,username)>0 LIMIT` + ' ' + start + ',' + pageSize;
        let sqlArr = [query];
        return Con.sySqlConnect(sql, sqlArr);
    }
}
let getUserListTotal = () => {
    let sql = `SELECT COUNT(*) AS total FROM blog_user`;
    let sqlArr = [];
    return Con.sySqlConnect(sql, sqlArr);
}

/*
 *
 */
addUser = async (req, res) => {
    let {
        username,
        password
    } = req.body;
    let rishave = await selectAddUser(username);
    let ishave = JSON.parse(JSON.stringify(rishave))[0].usercount;
    if (ishave === 0) {
        // 不存在
        await sqlAddUser(username, password);
        res.status(200).send({
            code: '200',
            msg: '添加成功',
        });
    } else {
        // 存在
        res.status(401).send({
            code: '401',
            msg: '用户名已存在'
        });
    }

}

// 判断用户名是否存在
let selectAddUser = (username)=>{
    let sql = `SELECT COUNT(*) AS usercount FROM blog_user WHERE username = ?`;
    let sqlArr = [username];
    return Con.sySqlConnect(sql,sqlArr); 
}

let sqlAddUser = (username, password) => {
    let sql = `INSERT INTO blog_user (username,password) VALUES (?,?)`;
    let sqlArr = [username, password];
    return Con.sySqlConnect(sql, sqlArr);
}

/*
 *
 */
deleteUser = async (req, res) => {
    console.log('删除请求')
    let id = req.params.id;
    await removeUser(id);
    res.status(200).send({
        code: '200',
        msg: '删除成功',
    });
}
let removeUser = (id) => {
    let sql = `DELETE FROM blog_user WHERE id = ?`;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr);
}

/*
 *
 */
updateUser = async (req, res) => {
    let id = req.params.id;
    let {
        password
    } = req.body;
    await sqlUpdateUser(id, password);
    res.status(200).send({
        code: '200',
        msg: '修改成功',
    });
}

let sqlUpdateUser = (id, password) => {
    let sql = `UPDATE blog_user SET password = ? WHERE id = ?`;
    let sqlArr = [password, id];
    return Con.sySqlConnect(sql, sqlArr);
}

/*
 *
 */
findUser = async (req, res) => {
    let id = req.params.id;
    let rdata = await sqlFindUser(id);
    let data = JSON.parse(JSON.stringify(rdata));
    res.status(200).send({
        data,
        code: '200',
        msg: '请求成功',
    });
}
let sqlFindUser = (id) => {
    let sql = `SELECT * FROM blog_user WHERE id = ?`;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr);
}

module.exports = {
    userList,
    addUser,
    deleteUser,
    updateUser,
    findUser
};