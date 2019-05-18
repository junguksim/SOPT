var express = require('express');
var router = express.Router();

router.use('/board', require('./board/index'));

module.exports = router;
