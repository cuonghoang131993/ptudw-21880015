"use strict";

const controller = {};
const models = require("../models");
const { Op } = require("sequelize");

controller.getData = async (req, res, next) => {
  // show categories
  const categories = await models.Category.findAll({
    include: [
      {
        model: models.Product,
      },
    ],
  });
  res.locals.categories = categories;

  // show brands
  const brands = await models.Brand.findAll({
    include: [
      {
        model: models.Product,
      },
    ],
  });
  res.locals.brands = brands;

  // show tags
  const tags = await models.Tag.findAll();
  res.locals.tags = tags;

  next();
};

controller.show = async (req, res) => {
  const category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
  const brand = isNaN(req.query.brand) ? 0 : parseInt(req.query.brand);
  const tag = isNaN(req.query.tag) ? 0 : parseInt(req.query.tag);
  const keyword = req.query.keyword ?? "";
  const sort = ["price", "newest", "popular"].includes(req.query.sort)
    ? req.query.sort
    : "price";
  const page = isNaN(req.query.page)
    ? 1
    : Math.max(1, parseInt(req.query.page));
  // show products
  let options = {
    attributes: ["id", "name", "imagePath", "stars", "price", "oldPrice"],
    where: {},
  };
  if (category > 0) {
    options.where.categoryId = category;
  }
  if (brand > 0) {
    options.where.brandId = brand;
  }
  if (tag > 0) {
    options.include = [
      {
        model: models.Tag,
        where: { id: tag },
      },
    ];
  }
  if (keyword.trim() !== "") {
    options.where.name = {
      [Op.iLike]: `%${keyword}%`,
    };
  }
  // select * from products where name like
  // %abc%;
  switch (sort) {
    case "newest":
      options.order = [["createdAt", "DESC"]];
      break;

    case "popular":
      options.order = [["stars", "DESC"]];
      break;

    default:
      options.order = [["price", "ASC"]];
      break;
  }
  res.locals.sort = sort;
  res.locals.originalUrl = removeParam("sort", req.originalUrl);
  if (Object.keys(req.query).length == 0) {
    res.locals.originalUrl = res.locals.originalUrl + "?";
  }

  // pagination
  const limit = 6;
  options.limit = limit;
  options.offset = (page - 1) * limit;
  const { rows, count } = await models.Product.findAndCountAll(options);
  res.locals.pagination = {
    page,
    limit,
    totalRows: count,
    queryParams: req.query,
  };

  // products = await models.Product.findAll(options);
  res.locals.products = rows;

  res.render("product-list");
};

controller.showDetails = async (req, res) => {
  const id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

  const product = await models.Product.findOne({
    attributes: [
      "id",
      "name",
      "stars",
      "oldPrice",
      "price",
      "summary",
      "description",
      "specification",
    ],
    where: { id },
    include: [
      {
        model: models.Image,
        attributes: ["name", "imagePath"],
      },
      {
        model: models.Review,
        attributes: ["id", "review", "stars", "createdAt"],
        include: [
          {
            model: models.User,
            attributes: ["firstName", "lastName"],
          },
        ],
      },
      {
        model: models.Tag,
        attributes: ["id"],
      },
    ],
  });
  res.locals.product = product;

  let tagIds = [];
  product.Tags.forEach((tag) => tagIds.push(tag.id));
  const relatedProducts = await models.Product.findAll({
    attributes: ["id", "name", "stars", "imagePath", "oldPrice", "price"],
    include: [
      {
        model: models.Tag,
        attributes: ["id"],
        where: {
          id: { [Op.in]: tagIds },
        },
      },
    ],
    limit: 10,
  });
  res.locals.relatedProducts = relatedProducts;

  res.render("product-detail");
};

function removeParam(key, sourceURL) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

module.exports = controller;
