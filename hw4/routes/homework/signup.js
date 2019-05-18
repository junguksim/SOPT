var express = require('express');
var router = express.Router();
const pool = require('../../modules/pool');
const cryptoPwd = require('../../modules/cryptoPwd');
const authUtil = require('../../modules/authUtil');
const resMsg = require('../../modules/responseMessage');
const statusCode = require('../../modules/statusCode');

router.post('/', async (req,res)=>{
    let body = req.body;
    const signUpQuery = 'INSERT INTO user (id,name,password,salt) VALUES (?,?,?,?)';
    let {hashed, salt} = await cryptoPwd.hashPwd(body.password);
    // await pool.getConnection((err,connection)=>{
    //     if(err) {
    //         console.log('connection err : ' + err);
    //         res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.DB_FAILED));
    //     }
    //     else {
    //         connection.query(signUpQuery, [body.id,body.name,hashed,salt],(err, result)=>{
    //             if(err) {
    //                 console.log('query failed : ' + err);
    //                 connection.rollback(function() {
    //                     console.log('rollback err : ' + err);
    //                     res.status(200).send(authUtil.successFalse(statusCode.DB_ERROR, resMsg.DB_FAILED));
    //                 })
    //             }
    //             else {
    //                 console.log('signUp success');
    //                 connection.release();
    //                 res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.ADD_DATA_SUCCESS));
    //             }
    //         })
    //     }
    // })
    if(await pool.queryParam_Arr(signUpQuery, [body.id,body.name,hashed,salt]) == undefined) {
        res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ALREADY_USER));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.SIGNUP_SUCCESS));
    }
})

module.exports = router;
