const db = require('./conn');

class stacksDB {
  constructor() {
  };

  // NOTE: When a new user signs up, we need to create a position for them in the positions table with their initial $100,000

  // [ { id: 1,
  //   user_id: 1,
  //   ticker: 'AAPL',
  //   company_name: 'Apple',
  //   num_shares: '10',
  //   cost_basis: '2243' },
  // { id: 2,
  //   user_id: 1,
  //   ticker: 'USERCASH',
  //   company_name: 'Cash',
  //   num_shares: '95292',
  //   cost_basis: '1' } ]

  
  // Buys the specified amount of stock and updates cash, records the transaction
  static async buyStock(userID, ticker, quantity, price, company_name) {
    let response;
    let purchasePrice = quantity * price;

    // Initializing the cash and stock objects
    let cash = {
      value: 0,
      positionID: 0
    };

    let stock = {
      ticker: ticker,
      shares: 0,
      basis: 0,
      positionID: 0
    };

    // Grab current positions (Cash and ticker)
    try {
      response = await db.any(`SELECT * FROM positions WHERE user_id = $1 AND (ticker = $2 OR ticker = 'USERCASH');`, [userID, ticker]);
    } catch(err) {
      console.log(`ERROR: Initial position query from User.buyStock method failed when buying ${ticker}.`);
      db.$pool.end(); return;
    }
    
    // Assigning values from the response
    if (response.length !== 0) {

      response.forEach((result) => {

        if (result.ticker === ticker) {
          stock.shares = Number(result.num_shares);
          stock.basis = Number(result.cost_basis);
          stock.positionID = result.id;
        } else if (result.ticker === 'USERCASH') {
          cash.value = Number(result.num_shares);
          cash.positionID = result.id;
        } else {
          console.log(`ERROR: Unexpected result from position query when buying ${ticker} from User.buyStock method.`);
          db.$pool.end(); return;
        }
      })
      console.log(stock);
      console.log(cash);
    };

    console.log(purchasePrice);

    // Ensures there's enough cash for the purchase
    if (cash.value < purchasePrice) {
      console.log(`Not enough cash to purchase the desired quantity of ${ticker}.`);
      db.$pool.end();
      return;
    }

    // Decrease cash by the purchase cost
    cash.value -= purchasePrice;
    let updateCash;

    // Post the new cash value
    try {
      updateCash = db.result(`UPDATE positions SET num_shares = $1 WHERE id = $2;`, [cash.value, cash.positionID]);
    } catch(err) {
      console.log(`ERROR: Issue when posting the updated cash after purchasing ${ticker} with the User.buyStock method.`);
      db.$pool.end(); return;
    }
    
    let updateStock, insertStock;
    // Either UPDATE or INSERT the position
    if (stock.positionID !== 0) {

      // Update the stock position. Already existed.
      try {
        updateStock = db.result(`UPDATE positions SET num_shares = $1, cost_basis = $2 WHERE id = $3;`, [stock.shares + quantity, stock.basis + purchasePrice, stock.positionID]);
      } catch(err) {
        console.log(`ERROR: Issue when posting the updated cash after purchasing ${ticker} with the User.buyStock method.`);
        db.$pool.end(); return;
      }

    } else {

      // Insert the stock position. Didn't already exist.
      try {
        insertStock = db.result(`INSERT INTO positions (user_id, ticker, company_name, num_shares, cost_basis) VALUES ($1, $2, $3, $4, $5);`, [userID, ticker, company_name, quantity, purchasePrice]);
      } catch(err) {
        console.log(`ERROR: Issue when posting the updated cash after purchasing ${ticker} with the User.buyStock method.`);
        db.$pool.end(); return;
      }

    }

    // Finally, record the transaction
    let insertTransaction;
    let currentTimestamp = Math.round(Date.now()/1000);
    try {
      insertTransaction = db.result(`INSERT INTO transactions (user_id, ticker, buy_sell, num_shares, stock_price, txn_date) VALUES ($1, $2, $3, $4, $5, to_timestamp($6));`, [userID, ticker, 'buy', quantity, price, currentTimestamp]);
    } catch(err) {
      console.log(`ERROR: Issue when posting the purchase transaction after buying ${ticker} with the User.buyStock method.`);
      db.$pool.end(); return;
    }

    db.$pool.end(); return;
  };

  // Sells the specified amount of stock and updates cash, records the transaction
  static async sellStock(userID, ticker, quantity, price) {

    let response;
    let salePrice = quantity * price;

    // Initializing the cash and stock objects
    let cash = {
      value: 0,
      positionID: 0
    };

    let stock = {
      ticker: ticker,
      shares: 0,
      basis: 0,
      positionID: 0
    };

    // Grab current positions (Cash and ticker)
    try {
      response = await db.any(`SELECT * FROM positions WHERE user_id = $1 AND (ticker = $2 OR ticker = 'USERCASH');`, [userID, ticker]);
    } catch(err) {
      console.log(`ERROR: Initial position query when selling ${ticker} from User.buyStock method failed.`);
      console.log(err);
      db.$pool.end(); return;
    }

    // Ensuring the ticker and cash were found
    if (response.length < 2) {
      console.log(`ERROR: No positions (cash or ${ticker}) were found for the user to sell.`)
      db.$pool.end(); return;
    };

    // Assigning values from the response
    response.forEach((result) => {

      if (result.ticker === ticker) {
        stock.shares = Number(result.num_shares);
        stock.basis = Number(result.cost_basis);
        stock.positionID = result.id;
      } else if (result.ticker === 'USERCASH') {
        cash.value = Number(result.num_shares);
        cash.positionID = result.id;
      } else {
        console.log(`ERROR: Unexpected result from position query when selling ${ticker} from User.buyStock method.`);
        db.$pool.end(); return;
      }
    })

    // Ensures there's enough stock to sell
    if (stock.shares < quantity) {
      console.log(`ERROR: Requested to sell ${quantity} shares of ${ticker} but user only has ${stock.shares} shares.`);
      db.$pool.end();
      return;
    }

    // Increase cash by the sale price
    cash.value += salePrice;
    let updateCash;

    // Post the new cash value
    try {
      updateCash = db.result(`UPDATE positions SET num_shares = $1 WHERE id = $2;`, [cash.value, cash.positionID]);
    } catch(err) {
      console.log(`ERROR: Issue when posting the updated cash after selling ${ticker} with the User.sellStock method.`);
      db.$pool.end(); return;
    }

    let updatePositions;
    // If we're SELLING ALL of the shares, remove the position entirely
    if (stock.shares === quantity) {
      // Remove the ticker from the positions
      try {
        updatePositions = db.result(`DELETE FROM positions WHERE id = $1;`, [stock.positionID]);
      } catch(err) {
        console.log(`ERROR: Issue when removing the entire position when selling ${ticker} with the User.sellStock method.`);
        db.$pool.end(); return;
      }
    } else {
      // If we're selling LESS THAN ALL of the shares, decrease the basis (average cost) and remove the shares
      let newCostBasis = stock.basis - (stock.basis / stock.shares) * quantity;
      try {
        updatePositions = db.result(`UPDATE positions SET num_shares = $1, cost_basis = $2 WHERE id = $3;`, [quantity, newCostBasis, stock.positionID]);
      } catch(err) {
        console.log(`ERROR: Issue when removing the sold portion of the position when selling ${ticker} with the User.sellStock method.`);
        db.$pool.end(); return;
      }
    }


    // Finally, record the transaction
    let insertTransaction;
    let currentTimestamp = Math.round(Date.now()/1000);
    try {
      insertTransaction = db.result(`INSERT INTO transactions (user_id, ticker, buy_sell, num_shares, stock_price, txn_date) VALUES ($1, $2, $3, $4, $5, to_timestamp($6));`, [userID, ticker, 'sell', quantity, price, currentTimestamp]);
    } catch(err) {
      console.log(`ERROR: Issue when posting the sale transaction after selling ${ticker} with the User.sellStock method.`);
      db.$pool.end(); return;
    }

    db.$pool.end(); return;
  }

  // Gives a new user an initial cash amount if they didn't already have cash.
  static async giveNewUserInitialCash(userID) {

    let initialCashValue = 100000;

    let response;
    // Grab the current cash for the user
    try {
      response = await db.any(`SELECT * FROM positions WHERE user_id = $1 AND ticker = 'USERCASH';`, [userID]);
    } catch(err) {
      console.log(`ERROR: Initial cash position query from stacksDB.giveNewUserInitialCash method failed for userID ${userID}.`);
      console.log(err);
      db.$pool.end(); return;
    }

    // Ensure the user doesn't already have cash
    if (response.length !== 0) {
      console.log(`ERROR: UserID ${userID} already had cash, but it was expected that initial cash would be 0. From stacksDB.giveNewUserInitialCash method.`);
      db.$pool.end(); return;
    }

    let insertCash;
    // Insert the cash position for the new user
    try {
      insertCash = await db.result(`INSERT INTO positions (user_id, ticker, company_name, num_shares, cost_basis) VALUES ($1, $2, $3, $4, $5);`, [userID, 'USERCASH', 'Cash', initialCashValue, 1]);
    } catch(err) {
      console.log(`ERROR: Issue when posting cash for new user ${userID} with the stacksDB.giveNewUserInitialCash method.`);
      db.$pool.end(); return;
    }

    db.$pool.end(); return;
  }




}

// stacksDB.buyStock(1, 'AMZN', 4, 150, 'Amazon');
// stacksDB.sellStock(1, 'AMZN', 4, 150);
stacksDB.giveNewUserInitialCash(2);


module.exports = stacksDB;