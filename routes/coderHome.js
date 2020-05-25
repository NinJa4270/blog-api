module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const coderHomeControllers = require('../controllers/web-controllers/coderHome')

    router.get('/coderhome',coderHomeControllers.coderHome)

    app.use('/web/api/v1', router);
}