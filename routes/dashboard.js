const express = require("express");
const router = express.Router();
const iex = require('../models/iex')


/* GET home page. */
router.get("/", async(req, res, next) => {
    const trendingNews = await iex.getTopBusinessNews(4);
    const allNews = await trendingNews.data;

    const trendingCompanies = await iex.getTrendingCompanies();
    const allCompanies = await trendingCompanies.data;

    const topCompanies = await iex.getTopEarningCompanies();
    const allTopEarners = await topCompanies.data;

    console.log("TRENDING", allNews)


    res.render("template", {
        locals: {
            title: "",
            isLoggedIn: req.session.is_logged_in,
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            newsData: allNews.articles,
            trendingData: allCompanies,
            topEarnerData: allTopEarners
        },
        partials: {
            partial: "partial-dashboard"
        }

    });
});



module.exports = router;