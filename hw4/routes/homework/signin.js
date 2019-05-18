var express = require('express');
var router = express.Router();
const pool = require('../../modules/pool');
var cryptoPwd = require('../../modules/cryptoPwd');
const authUtil = require('../../modules/authUtil');
const resMsg = require('../../modules/responseMessage');
const statusCode = require('../../modules/statusCode');

router.post('/', async (req, res) => {
    let body = req.body;
    const getSaltAndPwdQuery = 'SELECT salt,password FROM user WHERE id = ?';
    const checkIdQuery = 'SELECT id FROM user WHERE id = ?';
    const getUserIdxQuery = 'SELECT userIdx FROM user WHERE id = ?';
    const checkIdResult = (await pool.queryParam_Arr(checkIdQuery, [body.id]))[0];
    if (!checkIdResult) {
        res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NO_USER_IN_DATA));
    }
    else {
        let readSalt = (await pool.queryParam_Arr(getSaltAndPwdQuery, [body.id]))[0].salt;
        let readPwd = (await pool.queryParam_Arr(getSaltAndPwdQuery, [body.id]))[0].password;
        let getUserIdxResult = (await pool.queryParam_Arr(getUserIdxQuery, [checkIdResult.id]));
        console.log(checkIdResult);
        console.log(getUserIdxResult);
        if (await cryptoPwd.comparePwd(body.password, readSalt) != readPwd) {
            res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ID_OR_PASSWORD_INCORRECT));
        }
        else {
            res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.SIGNIN_SUCCESS, getUserIdxResult));
        }
    }
})



module.exports = router;
