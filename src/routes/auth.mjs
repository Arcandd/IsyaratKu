import { Router } from "express";
import passport from "passport";
import { checkSchema, matchedData } from "express-validator";

import {
  logInValidationSchema,
  signUpValidationSchema,
} from "../utils/validationSchema/authValid.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/crypting/hashPassword.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";

const router = Router();

router.post(
  "/login",
  checkSchema(logInValidationSchema),
  checkValidation,
  // passport.authenticate("local-login", {
  //   failureRedirect: false,
  //   failureMessage: true,
  // }),
  // (req, res) => {
  //   res.status(200).json({
  //     message: "Log in successful",
  //     user: {
  //       id: req.user.id,
  //       username: req.user.username,
  //     },
  //   });
  // }
  (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
      if (err) return res.status(500).json({ error: "Internal server error" });
      if (!user) return res.status(401).json(info); // `info` contains the error message like "User not found" or "Invalid credentials"

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        // If authentication and session creation are successful
        res.status(200).json({ message: "Login successful" });
      });
    })(req, res, next);
  }
);

// * TODO tambahin attribut foto profil di GET profile
router.post(
  "/signup",
  checkSchema(signUpValidationSchema),
  checkValidation,
  async (req, res) => {
    const data = matchedData(req); // ! Gunakan ini jika menggunakan express validasi
    data.password = hashPassword(data.password);
    const newUser = new User(data);

    if (await User.findOne({ username: newUser.username }))
      return res.status(400).json({ error: "User already exist" });

    try {
      const savedUser = await newUser.save(); // ! Harus menggunakan await karena save() sifatnya async, tambahkan async di depan (req, res)
      return res.status(201).json({ message: "Sign up successful" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server error" });
      console.log("Error in GET /api/auth/signup route:", err);
    }
  }
);

// ? Sementara, buata ngecek berhasil atau tidak
router.get("/status", (req, res) => {
  return req.user
    ? res.json({ username: req.user.username, status: "logged in" })
    : res.status(401).json({ error: "Unauthorized" });
});

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
