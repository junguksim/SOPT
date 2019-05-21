var express = require('express');
var router = express.Router();
var pool = require('../../modules/pool');
const upload = require('../../../hw5/config/multer');
const authUtil = require('../../../hw5/modules/authUtil');
const statusCode = require('../../modules/statusCode');
const resMsg = require('../../modules/responseMessage');

router.post('/', upload.single('profileImg') , async (req,res)=>{
    let body = req.body;
    let profileImg = req.file.location;
    let signUpQuery = 'INSERT INTO user (id, name, password, profileImg) VALUES (?,?,?,?)';
    if(await pool.queryParam_Arr(signUpQuery, [body.id,body.name, body.password,profileImg]) == undefined) {
        res.status(200).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ALREADY_USER));
    }
    else {
        res.status(200).send(authUtil.successTrue(statusCode.OK, resMsg.SIGNUP_SUCCESS));
    }
})

module.exports = router;