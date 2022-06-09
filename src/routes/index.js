const express = require("express");
const router = express.Router();

router.use("/home", (req, res) => {
  res.status(200).send("HOME PAGE");
});

router.use("/changepass", (req, res) => {
  res.status(200).send("Change Password PAGE");
});


module.exports = router;
