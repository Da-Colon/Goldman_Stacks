const express = require("express");
const router = express.Router();
const iex = require('../models/iex');
const portfolioValues = require('../controller/portfolio_values');
const returns = require('../controller/returns');
const db = require('../models/conn');


/* GET home page. */
router.get("/", async(req, res, next) => {
    const trendingNews = await iex.getTopBusinessNews(4);
    const allNews = await trendingNews.data;

    const trendingCompanies = await iex.getTrendingCompanies();
    const allCompanies = await trendingCompanies.data;

    const topCompanies = await iex.getTopEarningCompanies();
    const allTopEarners = await topCompanies.data;

    const leaderboard = await portfolioValues.getLeaderboardUsers(req.session.user_id);
    
    const userPortValues = await returns.getPortfolioValues(req.session.user_id);
    console.log('Logging all portfolio values:');
    console.log(userPortValues);


    // console.log("TRENDING", allCompanies)


    res.render("template", {
        locals: {
            title: "",
            isLoggedIn: req.session.is_logged_in,
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            newsData: allNews.articles,
            trendingData: allCompanies,
            topEarnerData: allTopEarners,
            leaders: leaderboard,
            portVals: userPortValues
        },
        partials: {
            partial: "partial-dashboard"
        }
    });

    // Checks if the daily portfolio values need to be updated.
    let updatedValues = await portfolioValues.updatePortfolioValuesIfNeeded(); 
    db.$pool.end(); // Done after the functions so we don't close the pool multiple times.

});



module.exports = router;