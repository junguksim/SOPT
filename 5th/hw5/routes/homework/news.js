var express = require('express');
var router = express.Router();
const pool = require('../../modules/pool');
const resMsg = require('../../modules/responseMessage');
const statusCode = require('../../modules/statusCode');
const authUtil = require('../../modules/authUtil');
const upload = require('../../config/multer');
const moment = require('moment');



router.get('/', async (req,res)=>{
    let selectQuery = 'SELECT * FROM board ORDER BY writetime DESC';
    let result = await pool.queryParam_None(selectQuery);
    if(!result) {
        res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.DB_FAILED));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.READ_DATA_SUCCESS, result));
    }

})

router.get('/:idx', async (req, res)=>{
    let target = req.params.idx;
    let selectBoardQuery = 'SELECT board.title, board.writetime FROM board WHERE board.boardIdx = ?';
    let selectContentQuery = 'SELECT content.content, content.image FROM content WHERE content.origin = ?';
    let boardResult = (await pool.queryParam_Arr(selectBoardQuery, [target]))[0];
    let contentResult = await pool.queryParam_Arr(selectContentQuery, [target]);
    if(!boardResult || !contentResult) {
        res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.DB_FAILED));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.READ_DATA_SUCCESS, {
            news : boardResult,
            content : contentResult
        }));
    }
})

router.post('/', upload.array('img'), async (req,res)=> {
    let body = req.body;
    let thumbnail = req.files[0].location;
    req.files.shift();
    let image = [];
    for(var i = 0 ; i < req.files.length ; i++) {
        image[i] = req.files[i].location;
    }
    let postBoardQuery = 'INSERT INTO board (title, thumbnail, writetime,writer) VALUES (?,?,?,?)';
    let postContentQuery = 'INSERT INTO content (image, content, origin) VALUES (?,?,?)';

    const insertTransaction = await pool.Transaction(async (connection)=>{
        const postBoardResult = await connection.query(postBoardQuery, [body.title, thumbnail, moment().format('YYYY-MM-DD HH:mm:ss'), body.writer]);
        let contentSplit = body.content.split('/', image.length);
        for(var i = 0 ; i < image.length; i++) {
            await connection.query(postContentQuery, [image[i], contentSplit[i], postBoardResult.insertId]);
        }
    });

    if(!insertTransaction) {
        res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.DB_FAILED));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.ADD_DATA_SUCCESS));
    }
})
module.exports = router;