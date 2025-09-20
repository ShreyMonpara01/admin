const express = require("express");
const path = require("path");
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
const Cookies = require("cookie-parser");
const { isLoggedIn } = require("./middlewares/isLogin");
const productRoute = require("./routes/product.route");
const passport = require("passport");
const session = require("express-session");
const initializer = require("./middlewares/passportAuth");
require("dotenv").config();
const app = express();
app.use(Cookies());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ejs
// session
app.use(session({ secret: "secret-key" }));
// passport
app.use(passport.initialize());
app.use(passport.session());

initializer(passport);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", isLoggedIn, (req, res) => {
  res.render("index");
});
app.use("/user", userRouter);
app.use("/products", productRoute);

app.get("/user-data", (req, res) => {
  res.send(req.user);
});
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log("listening on port on" + PORT);
  connection();
});
