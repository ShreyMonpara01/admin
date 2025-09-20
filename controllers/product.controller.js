const Product = require("../models/product.model");

const getProducts = async (req, res) => {
  let products = await Product.find();
  res.send(products);
};

const getProductsByUserId = async (req, res) => {
  const { userId } = req.cookies;
  let products = await Product.find({ userId: userId });
  res.send(products);
};

const createProduct = async (req, res) => {
  const { userId } = req.cookies;

  const { title, price, img } = req.body;
  let data = {
    title: title,
    price: price,
    img: img,
    userId: userId,
  };
  req.body.userId = userId;

  let product = await Product.create(data);
  res.send(product);
};

const getAddProductPage = (req, res) => {
  res.render("addProduct");
};
module.exports = {
  getProductsByUserId,
  getProducts,
  createProduct,
  getAddProductPage,
};
