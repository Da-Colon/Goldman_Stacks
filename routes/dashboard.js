const express = require("express");
const router = express.Router();
const iex = require('../models/iex')


/* GET home page. */
router.get("/", async(req, res, next) => {
    const trendingNews = await iex.getTopBusinessNews(4);
    const allNews = await trendingNews.data;

    console.log("Whats this?", trendingNews)
    console.log("Whats this?", allNews)
    res.render("template", {
        locals: {
            title: "",
            isLoggedIn: req.session.is_logged_in,
            userFirstName: req.session.first_name,
            userLastName: req.session.last_name,
            newsData: allNews.articles

        },
        partials: {
            partial: "partial-dashboard"
        }

    });
});



module.exports = router;