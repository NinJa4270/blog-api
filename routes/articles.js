module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const AuthenticatePolicy = require('../policies/AuthenticatePolicy');
    const articleControllers = require('../controllers/articles/articles')

    // 文章列表接口
    router.get('/articles', AuthenticatePolicy.isVaildToken, articleControllers.articleList);

    // 添加文章接口
    router.post('/articles', AuthenticatePolicy.isVaildToken, articleControllers.addArticle);

    // 删除文章接口
    router.delete('/articles/:id', AuthenticatePolicy.isVaildToken, articleControllers.deleteArticle);

    // 更新文章接口
    router.put('/articles/:id', AuthenticatePolicy.isVaildToken, articleControllers.updateArticle);

    // 文章详情接口
    router.get('/articles/:id', AuthenticatePolicy.isVaildToken, articleControllers.findArticle);

    // 作者列表接口
    router.get('/articlesuser', AuthenticatePolicy.isVaildToken, articleControllers.articleUserList);


    app.use('/admin/api/v1', router);
}