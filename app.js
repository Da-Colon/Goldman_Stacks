const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const es6Renderer = require("express-es6-template-engine");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

const session = require('express-session');
const Filestore = require('session-file-store')(session);


require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");
const tickerRouter = require("./routes/ticker");
const transactionRouter = require("./routes/transaction");

const app = express();

app.engine("html", es6Renderer);
app.set("views", "./views");
app.set("view engine", "html");

app.use(compression());
app.use(helmet());
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public/")));


app.use(session({
    // store: new Filestore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    is_logged_in: false
}));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/ticker", tickerRouter);
app.use("/transaction", transactionRouter);


module.exports = app;