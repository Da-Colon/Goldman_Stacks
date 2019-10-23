var express = require("express");
var router = express.Router();

router.get("/login", async (req, res, next) => {
    res.render("template", {
        locals: {
            title: "Login"
        },
        partials: {
            partial: "partial-login"
        }
    });
});

router.get("/signup", async (req, res, next) => {
    res.render("template", {
        locals: {
            title: "Sign Up"
        },
        partials: {
            partial: "partial-signup"
        }
    });
});

router.post("/signup", async (req, res, next) => {
    console.log(req.body);
    res.status(200).redirect("/");
});

router.post("/login", async (req, res, next) => {
    console.log(req.body);
    res.status(200).redirect("/");
});

module.exports = router;
