"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");

// Ham nay duoc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Ham duoc goi boi passport.session de lay thong tin cua user ty csdl ca dua vao req.user
passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: ["id", "email", "firstName", "lastName", "mobile", "isAdmin"],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Ham xac thuc nguoi dung khi dang nhap
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email", // ten dang nhap la email
      passwordField: "password",
      passReqToCallback: true, // cho phep truyen req vao callback de kiem tra user da dang nhap chua
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase(); // chuyen dia chi email sang ky tu thuong
      }
      try {
        if (!req.user) {
          // neu user chua dang nhap
          let user = await models.User.findOne({ where: { email } });
          if (!user) {
            // email chua ton tai
            return done(
              null,
              false,
              req.flash("loginMessage", "Email does not exist!")
            );
          }
          if (!bcrypt.compareSync(password, user.password)) {
            // neu mat khau khong dung
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid Password")
            );
          }
          // cho phep dang nhap
          return done(null, user);
        }
        // bo qua dang nhap
        done(null, req.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;