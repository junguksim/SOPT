var fs = require('fs');
const crypto = require("crypto-promise");

const fileUtil = {
    loadData: async (path) => {
        return new Promise((resolve) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    console.log('readFile err : ' + err);
                }
                else {
                    resolve(JSON.parse(data));
                }
            })
        })
    },
    writeNewFile: async (path, array) => {
        return new Promise((resolve) => {
            if (fs.existsSync(path)) {
                fs.writeFile(path, array, (err) => {
                    if (err) {
                        console.log('writeFile err : ' + err);
                    }
                    else {
                        console.log('writeFile success');
                        resolve();
                    }
                })
            }
        })
    },
    pwdCrypto: (password) => {
        return new Promise((resolve) => {
            async function cryptoPwd() {
                let salt = (await crypto.randomBytes(64)).toString('hex');
                let hashed = (await crypto.cipher('aes256',password)(salt)).toString('hex');
                resolve([hashed,salt])
            }
            cryptoPwd();
        });
    }
};


module.exports = fileUtil;