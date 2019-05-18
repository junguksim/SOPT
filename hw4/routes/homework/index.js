var express = require('express');
var router = express.Router();


router.get('/', (req,res)=>{
    res.send('main');
})
router.use('/board', require('./board/index'));
router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
module.exports = router;
