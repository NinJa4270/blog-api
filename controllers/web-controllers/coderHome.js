const Con = require('../../database/mysql');

// 图片列表
coderHome = async (req, res) => {
    let data1= await sqlCoderHome();
    let data = JSON.parse(JSON.stringify(data1))
    res.status(200).send({
        code:200,
        data,
        msg:'请求成功'
    })
}
let sqlCoderHome = ()=>{
    let sql = 'SELECT * FROM `web-home-img`';
    let sqlArr=[];
    return Con.sySqlConnect(sql,sqlArr)
}


module.exports = {
    coderHome
}