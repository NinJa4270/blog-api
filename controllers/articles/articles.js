const Con = require('../../database/mysql');

// 文章列表
articleList = async (req, res) => {
    let rqueryInfo = req.query.query;
    let queryInfo = JSON.parse(rqueryInfo)
    let {
        query,
        pageSize,
        pageNum
    } = queryInfo;
    let start = (pageNum - 1) * pageSize;
    let rdata = await sqlArticleList(query, start, pageSize);
    let data = JSON.parse(JSON.stringify(rdata));
    let rtotal = await sqlArticleListTotal();
    let total = JSON.parse(JSON.stringify(rtotal[0].total));
    res.status(200).send({
        data,
        total,
        code: '200',
        msg: '请求成功',
        pageNum
    })
}
let sqlArticleList = (query, start, pageSize) => {
    if (!query) {
        let sql = `SELECT 
        blog_article.id,
        blog_article.title,
        blog_article.cover,
        blog_article.introduce,
        blog_article.createTime,
        blog_article.updateTime,
        blog_user.username
    FROM
        blog_article
        INNER JOIN blog_user ON blog_article.user_id = blog_user.id limit` + ' ' + start + ',' + pageSize;
        let sqlArr = [];
        return Con.sySqlConnect(sql, sqlArr);
    } else {
        let sql = `SELECT 
        blog_article.id,
        blog_article.title,
        blog_article.cover,
        blog_article.introduce,
        blog_article.createTime,
        blog_article.updateTime,
        blog_user.username
    FROM
        blog_article
        INNER JOIN blog_user ON blog_article.user_id = blog_user.id WHERE LOCATE(?,title)>0 LIMIT` + ' ' + start + ',' + pageSize;
        let sqlArr = [query];
        return Con.sySqlConnect(sql, sqlArr);
    }
}
let sqlArticleListTotal = () => {
    let sql = `SELECT COUNT(*) AS total FROM blog_article`;
    let sqlArr = [];
    return Con.sySqlConnect(sql, sqlArr);
}

// 添加文章
addArticle = async (req, res) => {
    let {
        title,
        user_id,
        cover,
        introduce
    } = req.body;
    await sqlAddArticle(title, user_id, cover,introduce);
    res.status(200).send({
        code: '200',
        msg: '添加文章成功'
    })        
}
let sqlAddArticle = (title, user_id, cover,introduce) => {
    let sql = `INSERT INTO blog_article (title,user_id,cover,introduce) VALUES (?,?,?,?)`;
    let slqArr = [title, user_id, cover,introduce];
    return Con.sySqlConnect(sql, slqArr);
}

// 删除文章
deleteArticle = async (req, res) => {
    let id = req.params.id;
    await sqlDeleteArticle(id);
    res.status(200).send({
        code:200,
        msg:'删除成功'
    })
}
let sqlDeleteArticle =(id)=>{
    let sql = `DELETE FROM blog_article WHERE id = ?`;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr)
}

// 更新文章
updateArticle = async (req, res) => {
    let id = req.params.id;
    let {
        title,
        cover,
        introduce
    } = req.body;
    await sqlUpdateArticle(id, title, cover,introduce);
    res.status(200).send({
        code: '200',
        msg: '修改成功',
    });
}
let sqlUpdateArticle = (id, title, cover,introduce) => {
    let sql = `UPDATE blog_article SET title = ?, cover =?,introduce=? WHERE id = ?`;
    let sqlArr = [title, cover, introduce,id];
    return Con.sySqlConnect(sql, sqlArr)
}

// 文章详情
findArticle = async (req, res) => {
    let id = req.params.id;
    let rdata = await sqlFindArticle(id);
    let data = JSON.parse(JSON.stringify(rdata))
    res.status(200).send({
        data,
        code:200,
        msg: '请求成功'
    })
}

let sqlFindArticle = (id) => {
    let sql = `SELECT 
    blog_article.id,
    blog_article.title,
    blog_article.cover,
    blog_article.introduce,
    blog_article.createTime,
    blog_article.updateTime,
    blog_user.username
FROM
    blog_article
    INNER JOIN blog_user ON blog_article.user_id = blog_user.id WHERE blog_article.id = ?`;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr)
}

// 作者列表

articleUserList = async (req, res) => {
    let rdata = await sqlarticleUserList();
    let data = JSON.parse(JSON.stringify(rdata));
    res.status(200).send({
        data,
        code:200,
        msg: '请求成功'
    })
}
let sqlarticleUserList = () => {
    let sql = `SELECT id,username FROM blog_user`;
    let slqArr = [];
    return Con.sySqlConnect(sql, slqArr);
}

module.exports = {
    articleList,
    addArticle,
    deleteArticle,
    updateArticle,
    findArticle,
    articleUserList
}