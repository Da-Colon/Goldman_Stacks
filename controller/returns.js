const stacksDB = require('../models/stacksDB');
const API = require('../models/iex');

// Grabs all information needed for the Main Card on the home page
async function getPortfolioValues(userID) {

  // Fetches all positions
  let allPositions = await stacksDB.returnAllPositionsInPortfolio(userID);

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
  let allQuotes = await API.getMultipleCompanyQuotes(tickerArray);

  // Creates the values object we're going to return
  let portfolioValues = { 
    cash: 0, 
    totalPortfolio: { 
      valueChange: 0 
    }, 
    positions: {} 
  };

  // Adds cash to the values object
  portfolioValues.cash = Number(allPositionQuantities['USERCASH']);

  // Starts adding up the total portfolio value
  let portfolioTotalValue = 0;
  portfolioTotalValue += portfolioValues.cash;

  

  // Adds all position values to the object we're returning
  for (let key in allQuotes) {

    // Increments the total portfolio value
    let currentPrice = allQuotes[key].quote.latestPrice;
    let currentValue = currentPrice * allPositionQuantities[key];
    portfolioTotalValue += currentValue;

    // Adds the properties for each stock to the portfolioValues object
    portfolioValues.positions[key] = {};
    portfolioValues.positions[key].price = currentPrice;
    portfolioValues.positions[key].value = currentValue;
    portfolioValues.positions[key].valueChange = allQuotes[key].quote.change * allPositionQuantities[key];
    portfolioValues.positions[key].change = allQuotes[key].quote.change;
    portfolioValues.positions[key].changePercent = allQuotes[key].quote.changePercent;
    portfolioValues.positions[key].numShares = Number(allPositionQuantities[key]);

    // Increments the total value change of the portfolio
    portfolioValues.totalPortfolio.valueChange += portfolioValues.positions[key].valueChange;

  }

  // Adds the total portfolio value and calculates the % change
  portfolioValues.totalPortfolio.totalValue = portfolioTotalValue;
  portfolioValues.totalPortfolio.valueChangePercent = portfolioValues.totalPortfolio.valueChange / portfolioTotalValue;

  // console.log(portfolioValues);

  return (portfolioValues);

}

// getPortfolioValues(1);

module.exports = {
  getPortfolioValues
}