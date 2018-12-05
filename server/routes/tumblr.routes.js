const express = require('express');
const router = express.Router();
const tumblrCtrl = require('../controllers/tumblr.controller');

router.route("/").get(tumblrCtrl.getTumblr);

module.exports = router;
