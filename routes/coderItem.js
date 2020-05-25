module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const coderArticleItemControllers = require('../controllers/web-controllers/coderArticleItem');

    router.get('/coderitems/:id',coderArticleItemControllers.coderArticleItem)
    router.get('/coderitemMd/:id',coderArticleItemControllers.coderFindArticleItem)
    app.use('/web/api/v1', router);
}