const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const es6Renderer = require("express-es6-template-engine");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");


require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

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
app.use(express.static(path.join(__dirname, "public")));

// -----UNCOMMENT WHEN READY TO USE--------
// app.use(session({
//     store: new Filestore(),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     is_logged_in: false
// }));


app.use("/", indexRouter);
app.use("/users", usersRouter);


module.exports = app;