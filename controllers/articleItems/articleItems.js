const Con = require('../../database/mysql');
const fs = require('fs');
const path = require('path');

let myPath = path.join(__dirname, '../../uploads');
const {
    title
} = require('process');

// 章节列表
articleItemList = async (req, res) => {
    let rqueryInfo = req.query.query;
    let queryInfo = JSON.parse(rqueryInfo)
    let {
        query,
        pageSize,
        pageNum
    } = queryInfo;
    let start = (pageNum - 1) * pageSize;
    let rdata = await sqlArticleItemList(query, start, pageSize);
    let data = JSON.parse(JSON.stringify(rdata));
    let rtotal = await sqlArticleItemListTotal();
    let total = JSON.parse(JSON.stringify(rtotal[0].total));
    res.status(200).send({
        data,
        total,
        code: '200',
        msg: '请求成功',
        pageNum
    })
}
// 获取章节列表sql
let sqlArticleItemList = (query, start, pageSize) => {
    if (!query) {
        let sql = `SELECT
        blog_item.id,
        blog_item.item_title,
        blog_item.createTime,
        blog_item.updateTime,
        blog_item.md,
        blog_item.index,
        blog_article.title
   FROM
       blog_item
       INNER JOIN blog_article ON blog_item.pid = blog_article.id limit` + ' ' + start + ',' + pageSize;
        let sqlArr = [];
        return Con.sySqlConnect(sql, sqlArr);
    } else {
        let sql = `SELECT
        blog_item.id,
        blog_item.item_title,
        blog_item.createTime,
        blog_item.updateTime,
        blog_item.md,
        blog_item.index,
        blog_article.title
   FROM
       blog_item
       INNER JOIN blog_article ON blog_item.pid = blog_article.id WHERE LOCATE(?,item_title)>0 LIMIT` + ' ' + start + ',' + pageSize;
        let sqlArr = [query];
        return Con.sySqlConnect(sql, sqlArr);
    }
}
// 获取总数sql
let sqlArticleItemListTotal = () => {
    let sql = `SELECT COUNT(*) AS total FROM blog_item`;
    let sqlArr = [];
    return Con.sySqlConnect(sql, sqlArr);
}
// 添加章节
addArticleItem = async (req, res) => {
    let {
        pid,
        item_title,
        md,
        index,
        mdHtml,
    } = req.body
    let mdPath = myPath + '/md/' + item_title + '.md';
    // 将文章写入md并保存
    fs.writeFile(mdPath, md, (err) => {
        console.log(err)
    })
    // 将本地地址转为网络地址
    let mdUrl = `http://localhost:3006/uploads/md/` + item_title + '.md';
    // 将其他信息整合存入mysql
    await sqlAddArticleItem(item_title, pid, mdUrl, index, mdHtml);
    res.status(200).send({
        code: 200,
        msg: '成功'
    })
}
// 添加章节sql
let sqlAddArticleItem = (item_title, pid, mdUrl, index, mdHtml) => {
    let sql = `INSERT INTO blog_item (item_title,pid,md,blog_item.index,md_html) VALUES (?,?,?,?,?)`;
    let sqlArr = [item_title, pid, mdUrl, index, mdHtml];
    return Con.sySqlConnect(sql, sqlArr);
}

// 删除章节
deleteArticleItem = async (req, res) => {
    let id = req.params.id;
    // 先查询出信息数据库信息 删除本地文件
    let ritem_title = await sqlDeleteFindArticleItem(id);
    let item_title = JSON.parse(JSON.stringify(ritem_title[0].item_title));
    let path = myPath + '/md/' + item_title + '.md';
    fs.unlink(path, function (error) {
        if (error) {
            console.log(error);
            return false;
        }
    })
    await sqlDeleteArticleItem(id);
    res.status(200).send({
        code: 200,
        msg: '删除成功'
    })
}
// 查询信息sql
let sqlDeleteFindArticleItem = (id) => {
    let sql = `SELECT item_title from blog_item WHERE id = ?`;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr);
}
// 删除sql
let sqlDeleteArticleItem = (id) => {
    let sql = `DELETE FROM blog_item WHERE id = ?`;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr)
}

// 更新章节
updateArticleItem = async (req, res) => {
    let id = req.params.id;
    let {
        item_title,
        md,
        index,
        mdHtml
    } = req.body;
    console.log(mdHtml)
    let mdPath = myPath + '/md/' + item_title + '.md';
    await sqlupdateArticleItem(index, mdHtml, id);
    fs.writeFile(mdPath, md, (err) => {
        console.log(err)
    })
    res.status(200).send({
        code: 200,
        msg: '更新成功'
    })
}
let sqlupdateArticleItem = (index, mdHtml, id) => {
    let sql = `UPDATE blog_item SET blog_item.index = ?,md_html=? WHERE id = ?`;
    let sqlArr = [index, mdHtml, id];
    return Con.sySqlConnect(sql, sqlArr)
}

// 章节详情
findArticleItem = async (req, res) => {
    let id = req.params.id;
    let rdata = await sqlFindArticleItem(id);
    let data = JSON.parse(JSON.stringify(rdata[0]))
    // 读取文件内容
    let item_title = data.item_title;
    let path = myPath + '/md/' + item_title + '.md';
    fs.readFile(path, 'utf-8', (err, content) => {
        if (err) {
            res.status(401).send({
                code: 401,
                msg: '文件读取失败'
            })
        } else {
            data.md = content
            res.status(200).send({
                code: 200,
                msg: '请求成功',
                data
            })
        }
    })
}
// 章节详情sql
let sqlFindArticleItem = (id) => {
    let sql = `SELECT
	blog_item.id,
	blog_item.item_title,
    blog_item.md,
    blog_item.index,
    blog_item.md_html AS mdHtml,
    blog_article.title,
	blog_user.username 
FROM
	blog_item
	INNER JOIN blog_article ON blog_article.id = blog_item.pid
	INNER JOIN blog_user ON blog_article.user_id = blog_user.id 
WHERE
	blog_item.id = ? `;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr)
}
// 主标题列表
articleList = async (req, res) => {
    let rdata = await sqlArticleList();
    let data = JSON.parse(JSON.stringify(rdata));
    res.status(200).send({
        data,
        code: 200,
        msg: '请求成功'
    })
}
// 主标题列表sql
sqlArticleList = () => {
    let sql = `SELECT
	blog_article.id,
	blog_article.title,
	blog_user.username
FROM
	blog_article
	INNER JOIN blog_user ON blog_article.user_id = blog_user.id`;
    let sqlArr = [];
    return Con.sySqlConnect(sql, sqlArr)
}

module.exports = {
    articleItemList,
    addArticleItem,
    deleteArticleItem,
    updateArticleItem,
    findArticleItem,
    articleList
}