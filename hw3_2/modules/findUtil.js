var statusCode = require('./statusCode');
var resMsg = require('./responseMessage');
var crypto = require('crypto-promise');

const findUtil = {
    findTitle: (readData, findData) => {
        for (var i = 1; i < readData.length; i++) {
            if (findData === readData[i].title) {
                return(true);
            }
            else {
                console.log('id mismatch!');
                if(i === readData.length) {
                    return false;
                }
            }
        }
    },
    findId : (readData, findData) => {
        for(var i = 1 ; i < readData.length ; i++) {
            if(findData === readData[i].id) {
                return([true, readData[i], i]); // [0] == true, [1] == data, [2] == index
            }
            else {
                console.log('not match!');
                if(i === readData.length) {
                    return false;
                }
            }
        }
    },
    verifyPassword : (inputPwd, readSalt) => {
        return new Promise((resolve)=> {
            async function cryptoInputPwd() {
                const hashedInputPwd = (await crypto.cipher('aes256', inputPwd)(readSalt)).toString('hex');
                resolve(hashedInputPwd);
            }
            cryptoInputPwd();
        })
    }
}

module.exports = findUtil;