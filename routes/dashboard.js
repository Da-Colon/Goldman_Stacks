const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/dashboard", async(req, res, next) => {

    res.render("template", {
        locals: {
            title: "",

        },
        partials: {
            partial: "partial-dashboard"
        }
    });
});



module.exports = router;