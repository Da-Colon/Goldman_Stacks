const express = require("express");
const router = express.Router();
const iex = require('../models/iex');
const portfolioValues = require('../controller/portfolio_values');
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
    // console.log(req.session.user_id);
    console.log(leaderboard);

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
            leaders: leaderboard
        },
        partials: {
            partial: "partial-dashboard"
        }
    });

    // Checks if the daily portfolio values need to be updated.
    await portfolioValues.updatePortfolioValuesIfNeeded(); 
    db.$pool.end(); // Done after the functions so we don't close the pool multiple times.

});



module.exports = router;