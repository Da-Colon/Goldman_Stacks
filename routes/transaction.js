const express = require("express");
const router = express.Router();
const iex = require('../models/iex');
const portfolioValues = require('../controller/portfolio_values');
const returns = require('../controller/returns');
const db = require('../models/conn');
const stacksDB = require('../models/stacksDB');


router.post("/buy", async(req, res, next) => {

  const {ticker, user_id, price, company_name, num_shares} = req.body;

  const purchaseStock = await stacksDB.buyStock(Number(user_id), ticker, Number(num_shares), Number(price), company_name);

  res.redirect(req.get('referer'));

});


router.post("/sell", async(req, res, next) => {

  const {ticker, user_id, price, company_name, num_shares} = req.body;

  const sellStock = await stacksDB.sellStock(Number(user_id), ticker, Number(num_shares), Number(price), company_name);

  res.redirect(req.get('referer'));

});



module.exports = router;