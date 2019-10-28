const express = require("express");
const router = express.Router();
const iex = require('../models/iex');
const portfolioValues = require('../controller/portfolio_values');
const returns = require('../controller/returns');
const db = require('../models/conn');


router.post("/buy", async(req, res, next) => {

  const {ticker} = req.body;

  // NOTE: This isn't currently hooked up
  if (tickerFound) {
    res.status(200).redirect(`/ticker/${upperTicker}`);
  } else {
    res.redirect('back');
  }

});

router.post("/sell", async(req, res, next) => {

  const {ticker} = req.body;

  // NOTE: This isn't currently hooked up
  if (tickerFound) {
    res.status(200).redirect(`/ticker/${upperTicker}`);
  } else {
    res.redirect('back');
  }

});



module.exports = router;