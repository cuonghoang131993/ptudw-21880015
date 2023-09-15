"use strict";

const controller = {};
const models = require("../models");

controller.showHomepage = async (req, res) => {
  // GET brands
  const Brand = models.Brand;
  const brands = await Brand.findAll();

  // GET categories
  const Category = models.Category;
  const categories = await Category.findAll();
  const secondArray = categories.splice(2, 2);
  const thirdArray = categories.splice(1, 1);
  res.locals.categoryArray = [categories, secondArray, thirdArray];

  // GET featured-products
  const Product = models.Product;
  const featuredProducts = await Product.findAll({
    attributes: ["id", "name", "imagePath", "stars", "price", "oldPrice"],
    order: [["stars", "DESC"]],
    limit: 10,
  });
  res.locals.featuredProducts = featuredProducts;

  // GET recent-products
  const recentProducts = await Product.findAll({
    attributes: ["id", "name", "imagePath", "stars", "price", "oldPrice"],
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  res.locals.recentProducts = recentProducts;


  res.render("index", { brands });
};

controller.showPage = (req, res, next) => {
  const pages = [
    "cart",
    "checkout",
    "contact",
    "login",
    "my-account",
    "product-detail",
    "product-list",
    "wishlist",
  ];
  if (pages.includes(req.params.page)) return res.render(req.params.page);

  next();
};

module.exports = controller;
