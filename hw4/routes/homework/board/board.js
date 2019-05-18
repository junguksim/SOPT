var express = require('express');
var router = express.Router();
const pool = require('../../../modules/pool');
const authUtil = require('../../../modules/authUtil');
const cryptoPwd = require('../../../modules/cryptoPwd');
const resMsg = require('../../../modules/responseMessage');
const statusCode = require('../../../modules/statusCode');
const moment = require('moment');

router.get('/', async (req, res) => {
    let getBoardQuery = 'SELECT boardIdx, title, content, writer, writetime FROM board';
    let getBoardResult = (await pool.queryParam_None(getBoardQuery));
    console.log(getBoardResult);
    if (!getBoardResult) {
        res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.DB_FAILED));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.READ_DATA_SUCCESS, getBoardResult));
    }
});

router.get('/:idx', async (req, res) => {
    let getBoardQuery = 'SELECT title, content, writer, writetime FROM board WHERE boardIdx = ?';
    let getBoardResult = (await pool.queryParam_Parse(getBoardQuery, req.params.idx))[0];
    if (!getBoardResult) {
        res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.NO_USER_IN_DATA));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.READ_DATA_SUCCESS, getBoardResult));
    }
});

router.post('/', async (req, res) => {
    let body = req.body;
    let writeBoardQuery = 'INSERT INTO board (writer,title,content,writeTime,boardPw,salt) VALUES (?,?,?,?,?,?)';
    let time = moment().format('YYYY-MM-DD HH:mm:ss');

    if (body.boardPw == undefined) {
        res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.NULL_VALUE));
    }
    else {
        let { hashed, salt } = await cryptoPwd.hashPwd(body.boardPw);
        let writeBoardResult = await pool.queryParam_Arr(writeBoardQuery, [body.writer, body.title, body.content, time, hashed, salt]);
        if (writeBoardResult == undefined) {
            res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.NULL_VALUE));
        }
        else {
            res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.ADD_DATA_SUCCESS));
        }
    }

});

router.delete('/', async (req, res) => {
    let getPwdAndSaltQuery = 'SELECT boardPw,salt FROM board WHERE boardIdx = ?';
    let deleteBoardQuery = 'DELETE FROM board WHERE boardIdx = ?';
    let getBoardIdxQuery = 'SELECT boardIdx FROM board WHERE boardIdx = ?';
    let getPwdAndSaltResult = (await pool.queryParam_Arr(getPwdAndSaltQuery, [req.body.boardIdx]))[0];
    let getIdxResult = (await pool.queryParam_Arr(getBoardIdxQuery, [req.body.boardIdx]))[0];
    if (!getIdxResult) {
        res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.NO_DATA));
    }
    else {
        if (req.body.boardPw == undefined) {
            res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NULL_VALUE));
        }
        else {
            let cryptoResult = (await cryptoPwd.comparePwd(req.body.boardPw, getPwdAndSaltResult.salt));
            if (cryptoResult != getPwdAndSaltResult.boardPw) {
                res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ID_OR_PASSWORD_INCORRECT));
            }
            else {
                await pool.queryParam_Arr(deleteBoardQuery, [req.body.boardIdx]);
                res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.DATA_DELETE_SUCCESS));
            }
        }
    }


})

module.exports = router;