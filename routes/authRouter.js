"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const {
  body,
  getErrorMessage,
  getErrorMessages,
} = require("../controllers/validator");

router.get("/login", controller.show);
router.post(
  "/login",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email address!"),
  body("password").notEmpty().withMessage("Password is required!"),
  (req, res, next) => {
    let message = getErrorMessages(req);
    if (message) {
      return res.render("login", { loginMessage: message });
    }
    next();
  },
  controller.login
);
router.get('/logout', controller.logout);

module.exports = router;
