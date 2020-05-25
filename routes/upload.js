module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    const fs = require('fs');
    const path = require('path');
    let myPath = path.join(__dirname, '../uploads');
    // 章节图片地址
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            // 获取后缀
            let name = file.originalname.split('.');
            cb(null, file.fieldname + '-' + Date.now() + '.' + name[name.length - 1]);
        }
    })
    const upload = multer({
        storage: storage
    })
    // cover图片地址
    const storageCover = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/cover');
        },
        filename: function (req, file, cb) {
            // 获取后缀
            let name = file.originalname.split('.');
            cb(null, file.fieldname + '-' + Date.now() + '.' + name[name.length - 1]);
        }
    })
    const uploadCover = multer({
        storage: storageCover
    })
   
    // 单图上传
    router.post('/upload/img', upload.single('image'), (req, res) => {
        let path = req.file.path
        let imgPath = `http://localhost:3006/` + path.replace(/\\/g, "/")
        res.status(200).send({
            code: 200,
            imgPath,
            msg: '图片上传成功'
        })
    })
    // 单图删除
    router.post('/remove/img', (req, res) => {
        let {
            url
        } = req.body;
        let name = url.split('/').pop().replace(/\\/, '')
        let path = myPath + '\\' + name;
        fs.unlink(path, err => {
            if (err) {
                return res.send({
                    msg: "删除失败"
                })
            }
            res.send('成功')
        })
    })
    // article cover上传
    router.post('/upload/cover', uploadCover.single('file'), (req, res) => {
        let path = req.file.path;
        let rpath = path.replace(/\\/g, "/")
        let imgPath = `http://localhost:3006/` + rpath
        res.status(200).send({
            code: 200,
            imgPath,
            msg: '图片上传成功'
        })
    })
    // router.post('/remove/cover', (req, res) => {
    //     let {
    //         url
    //     } = req.body;
    //     let name = url.split('/').pop().replace(/\\/, '')
    //     let path = myPath + '\\' + name;
    //     fs.unlink(path, err => {
    //         if (err) {
    //             return res.send({
    //                 msg: "删除失败"
    //             })
    //         }
    //         res.send('成功')
    //     })
    // })

    app.use('/admin/api/v1', router);
}