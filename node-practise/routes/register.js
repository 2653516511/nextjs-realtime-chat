const express = require("express");
const router = express.Router();

const handlerNewUser = require("../controllers/registerController");

router.post("/", handlerNewUser.handlerNewUser);

module.exports = router;
