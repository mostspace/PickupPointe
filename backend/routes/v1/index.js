const express = require("express");

const shopperRouter = require("./shopper");
const vendorRouter = require("./vendor");
const merchantRouter = require("./merchant");

const router = express.Router();
const bindRouter = require("../../utils/router");

router.use("/shopper", bindRouter(shopperRouter));
router.use("/vendor", bindRouter(vendorRouter));
router.use("/merchant", bindRouter(merchantRouter));


module.exports = router;