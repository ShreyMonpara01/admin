const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const sendingMail = require("../services/mailService");

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let isExists = await User.findOne({ email: email });
    if (isExists) {
      return res.send("users already Exists");
    } else {
      let hash = await bcrypt.hash(password, 10);
      req.body.password = hash;
      let user = await User.create(req.body);
      return res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const getUser = async (req, res) => {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getUserById = async (req, res) => {
  try {
    let { userId } = req.params;
    let user = await User.findById(userId);
    res.status(202).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const updateUser = async (req, res) => {
  try {
    let { userId } = req.params;
    let user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(202).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    let { userId } = req.params;
    let user = await User.findByIdAndDelete(userId);
    res.status(202).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let isExists = await User.findOne({ email: email });
  if (!isExists) {
    return res.send("user not found");
  }

  const isMatched = await bcrypt.compare(password, isExists.password);

  if (!isMatched) {
    return res.send("invalid password");
  }
  res.cookie("username", isExists.username);
  res.cookie("userId", isExists.id);
  return res.send("logged in");
};

// pages
const getLoginPage = (req, res) => {
  res.render("login");
};
const getSignupPage = (req, res) => {
  res.render("signup");
};

// superadmin
const getAdmins = async (req, res) => {
  let admins = await User.find({ role: "admin", isVerified: false });
  res.send(admins);
};

// send mail

const sendMail = async (req, res) => {
  const { to, subject, content } = req.body;
  await sendingMail(to, subject, content);
  res.send("mail to: " + to);
};

// otp send mail

let otps = new Map();

const sendOtp = async (req, res) => {
  const { email } = req.body;

  let isExists = await User.findOne({ email: email });
  if (!isExists) {
    return res.send("user not found");
  }
  try {
    let otp = Math.round(Math.random() * 1000000);
    let html = `<h1>OTP : ${otp}</h1>`;
    await sendingMail(email, "password reset", html);
    res.redirect("/user/reset-password");
  } catch (error) {
    res.send(error.message);
  }
};

const verifyOtp = async (req, res) => {
  const { otp, password } = req.body;

  let data = otps.get(Number(otp));
  console.log(data);
  if (!data) {
    res.send("Invalid OTP ");
  }
  let user = await User.findOne({ email: data });
  //  hash password
  let hash = await bcrypt.hash(password, 10);
  user.password = hash;
  await user.save();
  res.send("password reseting...");
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserById,
  getLoginPage,
  getSignupPage,
  login,
  getAdmins,
  sendMail,
  sendOtp,
  verifyOtp,
};

// let test = new Map();
// test.set(100, "testing");
// console.log(test.get("100"));
// localhost:8090/user/rest/otp/:otp/userId/:userId
