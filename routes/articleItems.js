module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const AuthenticatePolicy = require('../policies/AuthenticatePolicy');
    const articleItemControllers = require('../controllers/articleItems/articleItems')

    // 文章章节列表接口
    router.get('/article-items', AuthenticatePolicy.isVaildToken, articleItemControllers.articleItemList);

    // 添加文章章节接口
    router.post('/article-items', AuthenticatePolicy.isVaildToken, articleItemControllers.addArticleItem);

    // 删除文章章节接口
    router.delete('/article-items/:id', AuthenticatePolicy.isVaildToken, articleItemControllers.deleteArticleItem);

    // 更新文章章节接口
    router.put('/article-items/:id', AuthenticatePolicy.isVaildToken, articleItemControllers.updateArticleItem);

    // 文章章节详情接口
    router.get('/article-items/:id', AuthenticatePolicy.isVaildToken, articleItemControllers.findArticleItem);

    // 文章列表接口
    router.get('/articleList', AuthenticatePolicy.isVaildToken, articleItemControllers.articleList);


    app.use('/admin/api/v1', router);
}