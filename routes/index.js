const express = require("express"),
    router = express.Router()

/* GET home page. */
router.get("/", async(req, res, next) => {

    res.render("template", {
        locals: {
            title: "",

        },
        partials: {
            partial: "partial-index"
        }
    });
});



module.exports = router;