const Con = require('../../database/mysql');
const fs = require('fs');
const path = require('path');

let myPath = path.join(__dirname, '../../uploads');
// 根据文章id 获取文章章节列表
coderArticleItem = async (req, res) => {
    let id = req.params.id;
    let rqueryInfo = req.query.query;
    let queryInfo = JSON.parse(rqueryInfo)
    let {
        pageSize,
        pageNum
    } = queryInfo;
    console.log(pageNum,pageSize)
    let start = (pageNum - 1) * pageSize;
    let data1 = await sqlCoderArticleItem(id, start, pageSize);
    // 判断是否有内容
    if (data1.length == 0) {
        res.status(200).send({
            code: 200,
            data: [],
            total:0,
            msg: '请求成功'
        })
    } else {
        let data = JSON.parse(JSON.stringify(data1))
        let rtotal = await sqlTotal(id);
        let {total} = JSON.parse(JSON.stringify(rtotal[0]))
        res.status(200).send({
            code: 200,
            data,
            total,
            msg: '请求成功'
        })
    }
}


let sqlCoderArticleItem = (id,start, pageSize) => {
    let sql = `SELECT * FROM blog_item WHERE blog_item.pid = ? limit` + ' ' + start + ',' + pageSize;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr)
}
// 计算总数
let sqlTotal=(id)=>{
    let sql = `SELECT COUNT(*) AS total FROM blog_item WHERE blog_item.pid = ? `;
    let sqlArr = [id];
    return Con.sySqlConnect(sql, sqlArr)
}

// 章节详情
coderFindArticleItem = async (req, res) => {
    let id = req.params.id;
    let rdata = await sqlFindArticleItem(id);
    let data = JSON.parse(JSON.stringify(rdata[0]))
    // 读取文件内容
    let item_title = data.item_title;
    let path = myPath + '/md/' + item_title + '.md';
    fs.readFile(path,'utf-8', (err, content) => {
        if (err) {
            res.status(401).send({
                code:401,
                msg:'文件读取失败'
            })
        } else {
            data.md = content
            res.status(200).send({
                code:200,
                msg:'请求成功',
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
    blog_item.md_Html AS mdHtml,
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
 

module.exports = {
    coderArticleItem,
    coderFindArticleItem
}