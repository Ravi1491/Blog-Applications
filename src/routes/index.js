const express = require("express");
const router = express.Router();

router.use("/registration", require("./user"));

router.use("/admin", require("./admin"));
router.use("/basic", require("./blog"));

router.use("/email", require("./emailService"));

router.use('/graphql', require('../graphql/index'))

router.get("/home", (req, res) => {
  res.status(200).send("HOME PAGE");
});

router.get("/changepass", (req, res) => {
  res.status(200).send("Change Password PAGE");
});

module.exports = router;
