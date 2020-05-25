const mysql = require('mysql');
module.exports = {
  // 数据库配置
  config: {
    host: 'localhost',
    port: '3306', //可选 默认3306
    user: 'root',
    password: '123456',
    database: 'my-blog', //连某个数据库
    multipleStatements: true
  },
  // 连接数据库，使用连接池
  // 连接池对象
  sqlConnect: function (sql, sqlArr, callBack) {
    var pool = mysql.createPool(this.config)
    pool.getConnection((err, conn) => {
      console.log('mysql数据连接成功')
      if (err) {
        console.log('连接失败');
        return;
      }
      // 事件驱动回调
      conn.query(sql, sqlArr, callBack);
      // 释放连接
      conn.release();
    })
  },
  // promise回调

  sySqlConnect(sySql, sqlArr) {
    return new Promise((resolve, reject) => {
      var pool = mysql.createPool(this.config)
      pool.getConnection((err, conn) => {
        console.log('mysql数据连接成功')
        if (err) {
          reject(err)
        } else {
          // 事件驱动回调
          conn.query(sySql, sqlArr, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          });
          // 释放连接
          conn.release();
        }
      })
    }).catch((err)=>{
      console.log(err)
    })
    
  }
}