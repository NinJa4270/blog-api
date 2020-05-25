module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const articleControllers = require('../controllers/articles/articles')

    // 文章列表接口
    router.get('/articles', articleControllers.articleList);
    // 文章详情
    router.get('/articles/:id',articleControllers.findArticle);
    
    app.use('/web/api/v1', router);
}