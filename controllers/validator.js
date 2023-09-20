"use strict";

const { body, validationResult } = require("express-validator");

function getErrorMessages(req) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = errors.array();
    return errorArray.reduce((message, error) => {
      return message + error.msg + "<br/>";
    }, "");
  }
  return null;
}

module.exports = { body, getErrorMessages };
