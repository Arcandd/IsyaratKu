import { Router } from "express";
import passport from "passport";
import { checkSchema, cookie, matchedData } from "express-validator";

import {
  logInValidationSchema,
  signUpValidationSchema,
} from "../utils/validationSchema/authValid.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/crypting/hashPassword.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";
import { Notification } from "../mongoose/schemas/notification.mjs";

const router = Router();

// ? Sementara, buata ngecek berhasil atau tidak
router.get("/status", (req, res) => {
  return req.user
    ? res.json({ username: req.user.username, status: "logged in" })
    : res.status(401).json({ error: "Unauthorized" });
});

router.post(
  "/login",
  checkSchema(logInValidationSchema),
  checkValidation,
  (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
      if (err) return res.status(500).json({ error: "Internal server error" });
      if (!user) return res.status(401).json(info); //? `info` contains the error message like "User not found" or "Invalid credentials"

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        res.status(200).json({
          message: "Login successful!",
          session: req.session.passport,
        });
      });
    })(req, res, next);
  }
);

// ? Untuk sign up / register
router.post(
  "/signup",
  checkSchema(signUpValidationSchema),
  checkValidation,
  async (req, res) => {
    const data = matchedData(req); // ! Gunakan ini jika menggunakan express validasi

    if (data.confirmPassword !== data.password)
      return res.status(400).json({ errors: ["Passwords do not match!"] });

    data.password = hashPassword(data.password);
    delete data.confirmPassword;

    const newUser = new User(data);

    try {
      if (await User.findOne({ username: newUser.username }))
        return res.status(400).json({ errors: ["User already exist!"] });

      const savedUser = await newUser.save(); // ! Harus menggunakan await karena save() sifatnya async, tambahkan async di depan (req, res)

      const newNotification = new Notification({
        title: "Welcome, " + savedUser.username,
        content: "Thank you for using IsyaratKu!",
        targetUser: savedUser._id,
      });
      await newNotification.save();

      req.login(savedUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed after signup" });
        }

        return res.status(201).json({
          message: "Sign up and login successful!",
          session: req.session.passport,
        });
      });
    } catch (err) {
      res.status(500).json({ error: "Internal Server error" });
      console.log("Error in GET /api/auth/signup route:", err);
    }
  }
);

router.post("/logout", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to destroy session" });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Log out successful" });
    });
  });
});

export default router;
