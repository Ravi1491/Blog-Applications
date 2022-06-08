const express = require('express')
const router = express.Router();

router.use("/admin", require('./admin'))
router.use("/basic", require('./blog'))

router.use("/registration", require('./user'))
router.use("/", require('./index'))

module.exports = router 