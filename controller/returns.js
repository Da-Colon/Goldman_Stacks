const stacksDB = require('../models/stacksDB');
const API = require('../models/iex');
const numeral = require('numeral');

// Grabs all information needed for the Main Card on the home page
async function getPortfolioValues(userID) {

  // Fetches all positions
  let allPositions = await stacksDB.returnAllPositionsInPortfolioNoClose(userID);

  // Extracts the number of shares
  let allPositionQuantities = {};
  allPositions.forEach((item) => {
    allPositionQuantities[item.ticker] = item.num_shares;
  })

  // Combines the tickers in an array
  let tickerArray = allPositions.map((position) => {
    return position.ticker;
  })

  // Gets the current prices of all tickers
  let allQuotes, allNews;
  if (allPositions.length > 1) {
    allQuotes = await API.getMultipleCompanyQuotes(tickerArray);
    allNews = await API.getMultipleCompanyNews(tickerArray);
  } else {
    allQuotes = {};
    allNews = {};
  }


  // Creates the values object we're going to return
  let portfolioValues = { 
    cash: 0, 
    totalPortfolio: { 
      valueChange: 0 
    }, 
    positions: [],
    news: []
  };

  // Adds cash to the values object
  portfolioValues.cash = numeral(Number(allPositionQuantities['USERCASH'])).format('$0,0');

  // Starts adding up the total portfolio value
  let portfolioTotalValue = 0;
  portfolioTotalValue += Number(allPositionQuantities['USERCASH']);
  

  // Adds all position values to the object we're returning
  for (let key in allQuotes) {

    // Increments the total portfolio value
    let currentPrice = allQuotes[key].quote.latestPrice;
    let currentValue = currentPrice * allPositionQuantities[key];
    portfolioTotalValue += currentValue;

    // Adds the properties for each stock to the portfolioValues object
    let tempObj = {};
    tempObj.symbol = key;
    tempObj.price = currentPrice;
    tempObj.value = numeral(currentValue).format('$0,0');
    tempObj.valueChange = allQuotes[key].quote.change * allPositionQuantities[key];
    tempObj.change = allQuotes[key].quote.change;
    tempObj.changePercent = numeral(allQuotes[key].quote.changePercent).format('0.0%');
    tempObj.numShares = Number(allPositionQuantities[key]);
    portfolioValues.positions.push(tempObj);

    // Increments the total value change of the portfolio
    portfolioValues.totalPortfolio.valueChange += tempObj.valueChange;

  }

  // Parses the relevant news articles
  for (let ticker in allNews) {
    let tempObj = {};
    tempObj.symbol = ticker;
    tempObj.headline = allNews[ticker].news[0].headline.replace(/^(.{100}[^\s]*).*/, "$1") + "...";
    tempObj.url = allNews[ticker].news[0].url;
    portfolioValues.news.push(tempObj);
  }
  
  // Adds the total portfolio value and calculates the % change
  portfolioValues.totalPortfolio.totalValue = numeral(portfolioTotalValue).format('$0,0');
  portfolioValues.totalPortfolio.valueChangeStr = numeral(portfolioValues.totalPortfolio.valueChange).format('$0,0');
  portfolioValues.totalPortfolio.valueChangePercent = numeral(portfolioValues.totalPortfolio.valueChange / portfolioTotalValue).format('0.0%');

  return (portfolioValues);

}

// Returns the %change (as a decimal) for each of the 4 indices on the dashboard
async function getIndexValues() {
  // SPY for S&P 500
  // EFA for MSCI EAFE
  // IWB for Russell 1000
  // IWM for Russell 2000

  let indexInfo = {
    SP500: {
      percentChange: 0
    },
    Russell1000: {
      percentChange: 0
    },
    Russell2000: {
      percentChange: 0
    },
    MSCIEAFE: {
      percentChange: 0
    },
  }

  const allQuotes = await API.getMultipleCompanyQuotes(['SPY', 'EFA', 'IWB', 'IWM']);

  indexInfo.SP500.percentChange = allQuotes.SPY.quote.changePercent;
  indexInfo.Russell1000.percentChange = allQuotes.IWB.quote.changePercent;
  indexInfo.Russell2000.percentChange = allQuotes.IWM.quote.changePercent;
  indexInfo.MSCIEAFE.percentChange = allQuotes.EFA.quote.changePercent;

  return allQuotes;
}

// getIndexValues();

getPortfolioValues(1);

module.exports = {
  getPortfolioValues,
  getIndexValues
}