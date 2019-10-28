const Moment = require('moment');
const stacksDB = require('../models/stacksDB');
const db = require('../models/conn');
const API = require('../models/iex');

// Checks for non-null dates in users prior to today
async function needToUpdatePortfolioValues(users) {

  let updateUserValues = false;

  // Checks to see if any non-null portfolio dates aren't from today.
  //   If so, flag that we need to updateUserValues.
  let today = Moment(Date.now());
  users.forEach(user => {
    if (user.value_date !== null) {
      (today.diff(user.value_date, 'days')) && (updateUserValues = true);
    }
  });

  // console.log(updateUserValues);
  return updateUserValues;

}

// THIS WILL PROBABLY HAVE A LITTLE DELAY. I'D RECOMMEND ALWAYS SERVING
// the current data, and once that request is over then run this as a callback function.
async function updatePortfolioValuesIfNeeded() {

  // Pull the users from the database
  let users = await stacksDB.getAllUsersNoClose();
  
  // Check if any portfolio values are outdated
  let needToUpdate = await needToUpdatePortfolioValues(users);

  // If no need to update, exit the function
  if (!needToUpdate) {
    console.log("All portfolio values are up to date");
    return;
  }

  console.log("Updating all portfolio values in the user database.");

  // Pull a list of all unique ticker symbols in the DB
  let tickers = await stacksDB.getAllUniqueTickersNoClose();

  // Combines the tickers in an array
  let tickerArray = tickers.map((item) => {
    return item.ticker;
  })

  let i = 0;
  let numInGroup = 2;
  let closePrices = {};

  // Query the API for all tickers and record closing prices
  while (i < tickerArray.length) {

    // The API limits us to 50 tickers per request, but we can make multiple requests
    let tickerSlice = tickerArray.slice(i, i+numInGroup);
    let sliceQuotes = await API.getMultipleCompanyQuotes(tickerSlice);
    
    for (let key in sliceQuotes) {
      closePrices[key] = sliceQuotes[key].quote.previousClose;
    }

    i += numInGroup;
  }

  // Today's date, for posting to user DB
  const todayString = Moment(Date.now()).format('YYYY-MM-DD');

  // Calculate and post the portfolio value for each user
  for (let user of users) {

    let userPortfolioValue = 0;
    // Get all positions that user has
    let allPositions = await stacksDB.returnAllPositionsInPortfolioNoClose(user.id);  

    // For each position, add that value to the user's portfolio value
    for (let position of allPositions) {
      if (position.ticker === 'USERCASH') {
        userPortfolioValue += Number(position.num_shares);
      } else {
        userPortfolioValue += Number(position.num_shares) * closePrices[position.ticker];
      }
    }

    // Post the updated value to the user DB
    let updateDB = await stacksDB.updateUserPortfolioNoClose(user.id, userPortfolioValue, todayString);

  };

  // db.$pool.end();

}

// Returns the top ranking users (by total portfolio value)
async function getLeaderboardUsers(currentUserID) {

    let numUsersToReturn = 5;

    // Pull the users from the database
    let users = await stacksDB.getAllUsersNoClose();
    let leaderboard = [];

    // Sorts the user array
    users.sort((a, b) => {
      return Number(a.portfolio_value) < Number(b.portfolio_value);
    });

    // Loops through the top, capped at the number of users
    let i = 0;
    while (i < Math.min(numUsersToReturn, users.length)) {

      // Sets user's name as 'You' or abbreviation, like 'Josh M.'
      let userName;
      (users[i].id === currentUserID) ? userName = 'You' : userName = `${users[i].first_name} ${users[i].last_name.charAt(0)}.`;

      // Creates an object with the top user values
      let userValue = {
        id: users[i].id,
        name: userName,
        portfolio_growth: (users[i].portfolio_value / 100000 - 1)
      }

      leaderboard.push(userValue);
      i++;
    }


    return leaderboard;

}


module.exports = {
  updatePortfolioValuesIfNeeded,
  getLeaderboardUsers
}

updatePortfolioValuesIfNeeded();
// getLeaderboardUsers(1);