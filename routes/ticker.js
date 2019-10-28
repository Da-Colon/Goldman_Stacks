const express = require("express");
const router = express.Router();
const iex = require('../models/iex');
const portfolioValues = require('../controller/portfolio_values');
const returns = require('../controller/returns');
const db = require('../models/conn');
const tickerList = require('../models/tickerList');


router.post("/", async(req, res, next) => {

  const {ticker} = req.body;
  let upperTicker = ticker.toUpperCase();
  let tickerFound = tickerList.tickers.includes(upperTicker);
  console.log(tickerFound);

  if (tickerFound) {
    res.status(200).redirect(`/ticker/${upperTicker}`);
  } else {
    res.redirect('back');
  }

});

router.get("/:ticker", async(req, res, next) => {

  const ticker = req.params.ticker;

  console.log(ticker);

  // NOT HOOKED UP YET
  if (tickerFound) {
    res.status(200).redirect(`/ticker/${upperTicker}`);
  } else {
    res.redirect('back');
  }

});





module.exports = router;