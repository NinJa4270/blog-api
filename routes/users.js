module.exports = app => {
  const express = require('express');
  const router = express.Router();
  const AuthenticatePolicy = require('../policies/AuthenticatePolicy');
  const postLogin = require('../controllers/users/login');
  const postRegister = require('../controllers/users/register');
  const userControllers = require('../controllers/users/users')


  /**
   * @swagger
   *
   * /admin/api/v1/login:
   *   post:
   *     description: 主页登录接口
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: username
   *         description: 用户名
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: 用户密码.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: 成功返回token
   */
  router.post('/login', postLogin);
  // 注册接口
  router.post('/register', postRegister);

  // 用户列表接口
  router.get('/users', AuthenticatePolicy.isVaildToken, userControllers.userList);

  // 添加用户接口
  router.post('/users', AuthenticatePolicy.isVaildToken, userControllers.addUser);

  // 删除用户接口
  router.delete('/users/:id', AuthenticatePolicy.isVaildToken, userControllers.deleteUser);

  // 更新用户接口
  router.put('/users/:id', AuthenticatePolicy.isVaildToken, userControllers.updateUser);

  // 用户详情接口
  router.get('/users/:id', AuthenticatePolicy.isVaildToken, userControllers.findUser);

  app.use('/admin/api/v1', router);
}