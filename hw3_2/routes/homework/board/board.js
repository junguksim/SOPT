var express = require('express');
var router = express.Router();
var statusCode = require('../../../modules/statusCode');
var resMsg = require('../../../modules/responseMessage');
var fileUtil = require('../../../modules/fileUtil');
var findUtil = require('../../../modules/findUtil');
const authUtil = require('../../../modules/authUtil');
const moment = require('moment');
const SIMPLE_FORMAT = "YYYY-MM-DD HH:mm:ss";



router.get('/:id', async (req, res) => {
    let inputId = req.params.id;
    let readData = await fileUtil.loadData('data.txt');
    console.log('inputId : ' + inputId);
    if(inputId === undefined) {
        res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NULL_VALUE));
    }
    for (var i = 0; i < readData.length; i++) {
        if (readData[i].id == inputId) {
            res.status(statusCode.OK).send(authUtil.successTrue(statusCode.OK, resMsg.READ_FILE_SUCCESS,
                {
                    id : readData[i].id,
                    title : readData[i].title,
                    section : readData[i].section,
                    time : readData[i].time
                }));
                return;
        }
        else {
            if (i === readData.length - 1) {
                console.log('readId : ' + readData[i].id);
                res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NO_USER_IN_DATA));
                return;
            }
        }
    }
});

router.post('/', async (req, res) => {
    const insertPassword = req.body.password;
    let body = req.body;
    let cryptoData = await fileUtil.pwdCrypto(insertPassword);
    let postData = {
        id: body.id,
        title: body.title,
        section: body.section,
        time: moment().format(SIMPLE_FORMAT),
        password: cryptoData[0],
        salt: cryptoData[1]
    };
    if(body.id === undefined || body.title === undefined || body.section === undefined || body.password === undefined) {
        res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NULL_VALUE));
    }
    let readData = await fileUtil.loadData('data.txt');
    for (var i = 0; i < readData.length; i++) {
        if (readData[i].title == body.title) {
            res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.HAVE_SAME_TITLE));
            return;
        }
        else {
            if(i === readData.length-1) {
                readData[readData.length] = postData;
                await fileUtil.writeNewFile('data.txt', JSON.stringify(readData));
                res.status(statusCode.OK).send(authUtil.successTrue(statusCode.OK, resMsg.WRITE_FILE_SUCCESS));
                return;
            }
        }
    }

});

router.put('/', async (req, res) => {
    let readData = await fileUtil.loadData('data.txt');
    let body = req.body;
    if(body.id === undefined || body.section === undefined || body.password === undefined) {
        res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NULL_VALUE));
    }
    for (var i = 0; i < readData.length; i++) {
        if (readData[i].id != body.id) {
            if (i === readData.length - 1) {
                res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ID_OR_PASSWORD_INCORRECT));
                return;
            }
        }
        else {
            if (readData[i].password != await findUtil.verifyPassword(body.password, readData[i].salt)) {
                res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ID_OR_PASSWORD_INCORRECT));
                return;
            }
            else {
                readData[i].section = body.section;
                await fileUtil.writeNewFile('data.txt', JSON.stringify(readData));
                res.status(statusCode.OK).send(authUtil.successTrue(statusCode.OK, resMsg.DATA_CHANGE_SUCCESS));
                return;
            }
        }
    }
});

router.delete('/', async (req, res) => {
    let readData = await fileUtil.loadData('data.txt');
    let body = req.body;
    if(body.id === undefined || body.password === undefined) {
        res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.NULL_VALUE));
    }
    for (var i = 0; i < readData.length; i++) {
        if (readData[i].id != body.id) {
            if (i === readData.length - 1) {
                res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ID_OR_PASSWORD_INCORRECT));
                return;
            }
        }
        else {
            if (readData[i].password != await findUtil.verifyPassword(body.password, readData[i].salt)) {
                res.status(statusCode.BAD_REQUEST).send(authUtil.successFalse(statusCode.BAD_REQUEST, resMsg.ID_OR_PASSWORD_INCORRECT));
                return;
            }
            else {
                readData.splice(i, 1);
                await fileUtil.writeNewFile('data.txt', JSON.stringify(readData));
                res.status(statusCode.OK).send(authUtil.successTrue(statusCode.OK, resMsg.DATA_DELETE_SUCCESS));
                return;
            }
        }
    }
})

module.exports = router;