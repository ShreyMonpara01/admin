const { Router } = require("express");
const {
  getProducts,
  getProductsByUserId,
  createProduct,
  getAddProductPage,
} = require("../controllers/product.controller");
const { isLoggedIn } = require("../middlewares/isLogin");

const productRoute = Router();

productRoute.get("/add-product", isLoggedIn, getAddProductPage);

productRoute.get("/", getProducts);
productRoute.get("/user-id", isLoggedIn, getProductsByUserId);
productRoute.post("/", isLoggedIn, createProduct);

module.exports = productRoute;
