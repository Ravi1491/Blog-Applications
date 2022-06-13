const express = require("express");
const router = express.Router();

router.get("/home", (req, res) => {
  res.status(200).send("HOME PAGE");
});

router.get("/changepass", (req, res) => {
  res.status(200).send("Change Password PAGE");
});


module.exports = router;
