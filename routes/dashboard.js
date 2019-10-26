const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", async(req, res, next) => {

    res.render("template", {
        locals: {
            title: "",
            isLoggedIn: req.session.is_logged_in

        },
        partials: {
            partial: "partial-dashboard"
        }
    });
});



module.exports = router;