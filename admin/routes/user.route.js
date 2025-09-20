const { Router } = require("express");
const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getLoginPage,
  getSignupPage,
  login,
  getAdmins,
  sendMail,
  sendOtp,
  verifyOtp,
} = require("../controllers/user.controller");
const passport = require("passport");
const { isLoggedIn } = require("../middlewares/isLogin");
const { isSuperadmin } = require("../middlewares/role");

const userRouter = Router();


userRouter.get("/reset-password", (req, res) => {
  res.render("resetpassword");
});
userRouter.post("/send-otp", sendOtp);

userRouter.get("/admin-list", isLoggedIn, isSuperadmin, getAdmins);
// pages
userRouter.get("/login", getLoginPage);
userRouter.get("/signup", getSignupPage);
userRouter.get("/", getUser);
userRouter.get("/:userId", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/:userId", updateUser);
userRouter.delete("/:userId", deleteUser);
// userRouter.post("/login", login);
userRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    successRedirect: "/",
  })
);

// super admins routes

// mail routes

userRouter.post("/mail", sendMail);

// password reset routes


userRouter.post("/reset-password", verifyOtp);

module.exports = userRouter;
