const express = require("express");
const router = express.Router();
const iex = require('../models/iex');
const portfolioValues = require('../controller/portfolio_values');
const returns = require('../controller/returns');
const db = require('../models/conn');



/* GET home page. */
router.get("/", async(req, res, next) => {
    // Check to see if user is logged in, if not redirect to home page
    if (req.session.user_id === undefined) {
        res.redirect('/');
    }

    const trendingNewsAPI = await iex.getTopBusinessNews(4);
    const newsResults = await trendingNewsAPI.data;

    const trendingCompaniesAPI = await iex.getTrendingCompanies();
    const trendingResults = await trendingCompaniesAPI.data;

    const markets = await returns.getIndexValues();

    const leaderboard = await portfolioValues.getLeaderboardUsers(req.session.user_id);

    const userPortValues = await returns.getPortfolioValues(req.session.user_id);

    res.render("template", {
        locals: {
            title: "GoldmanStacks",
            isLoggedIn: req.session.is_logged_in,
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            newsData: newsResults.articles,
            trendingData: trendingResults,
            market: markets,
            leaders: leaderboard,
            portVals: userPortValues
        },
        partials: {
            partial: "partial-dashboard"
        }
    });

    // Checks if the daily portfolio values need to be updated.
    let updatedValues = await portfolioValues.updatePortfolioValuesIfNeeded();
    // db.$pool.end(); // Done after the functions so we don't close the pool multiple times.

});



module.exports = router;