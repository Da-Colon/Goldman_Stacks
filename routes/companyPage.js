const express = require("express");
const router = express.Router();
const iex = require("../models/iex")

/* GET home page. */
router.get("/", async(req, res, next) => {

    const companyStockInfo = await iex.getStockPrice('FB');
    const stockData = await companyStockInfo.data;
    // console.log("COMPANY----INFO", stockData)

    const companyNews = await iex.getSingleCompanyNews('FB');
    const newsData = await companyNews.data;
    console.log("COMPANY------NEWS", companyNews)




    res.render("template", {
        locals: {
            title: "",
            isLoggedIn: req.session.is_logged_in,
            userFirstName: req.session.first_name,
            companyStockData: stockData,
            companyNewsData: newsData,

        },
        partials: {
            partial: "partial-companyPage"
        }
    });
});

router.post("/search", async(req, res, next) => {
    const { searcn_bar } = req.body;

    console.log("SEARCH", req.body.search_bar);

    // if (addUser) {
    //     stacksDB.giveNewUserInitialCash(addUser.id);
    //     res.status(200).redirect("/companyPage");
    // } else {
    //     res.sendStatus(500);
    // }

});


module.exports = router;