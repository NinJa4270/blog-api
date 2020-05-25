const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


// 托管静态文件
app.use('/uploads', express.static(__dirname + '/uploads'))

// 中间件 解决跨域、解构body
app.use(require('cors')())
app.use(bodyParser())

// 引入路由
require('./routes/users')(app)
require('./routes/articles')(app)
require('./routes/articleItems')(app)
require('./routes/upload')(app)

// web端路由
require('./routes/coderHome')(app)
require('./routes/coderArticle')(app)
require('./routes/coderItem')(app)

// swagger接口文档
// const options = {
//     swaggerOptions:{
//         url:'http://localhost:3006/admin/api/v1'
//     },
//     definition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'blog Api接口文档',
//             version: '1.0.0',
//             description: 'blog Api接口文档'
//         }
//     },
//     apis: [path.join(__dirname, '/routes/*.js')]
// }
// const swaggerSpec = swaggerJSDoc(options);
// app.use('/admin/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const port = process.env.PORT || 3006
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})