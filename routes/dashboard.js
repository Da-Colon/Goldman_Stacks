const express = require("express");
const router = express.Router();
const iex = require('../models/iex')


/* GET home page. */
router.get("/", async(req, res, next) => {
    const trendingNews = await iex.getTopBusinessNews(4);
    const allNews = await trendingNews.data;

    const trendingCompanies = await iex.getTrendingCompanies();
    const allCompanies = await trendingCompanies.data;

    console.log("TRENDING", allCompanies)


    res.render("template", {
        locals: {
            title: "",
            isLoggedIn: req.session.is_logged_in,
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            newsData: allNews.articles,
            trendingData: await allCompanies

        },
        partials: {
            partial: "partial-dashboard"
        }

    });
});



module.exports = router;