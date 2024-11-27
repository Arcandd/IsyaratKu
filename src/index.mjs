// ? bisa pake import gara gara di package.json ditambahin type: "module"
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "dotenv/config";
import MongoStore from "connect-mongo";

import routes from "./routes/index.mjs";
import "./strategies/passportLocal.mjs";

// ! Tes akun
// {
//   "username": "Ambasing",
//   "password": "password123"
// }
// {
//   "username": "Aji Cina",
//   "password": "password123"
// }

const app = express();

app.set("json spaces", 2);

const mongoUrl = process.env.MONGO_URL;
const secretKey = process.env.SECRET_KEY;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
// app.use(cookieParser("secret-key")); // ! Gunakan jika aplikasi membutuhkan handling user preferences (theme, language) atau mentrack behaviour user
app.use(
  session({
    secret: secretKey, // ! Ini kaya password, harus yang tidak mudah ditebak
    saveUninitialized: false, // ? Jika di set ke true, maka semua session akan disimpan walaupun session tsb tidak di modifikasi
    resave: false, // ? jika di set true, maka setiap kali kita melakukan request, cookienya akan di save kembali, eg(waktunya dari 14.49.39 nambah jadi 14.49.41)
    cookie: {
      maxAge: 60000 * 60 * 24, // ? durasi session 1 hari
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
); // ! Selalu declare session sebelum endpoint (routes)
app.use(passport.initialize()); // ! Selalu declare setelah session dan sebelum endpoint
app.use(passport.session()); // ? Karena kita sudah pake ini, semua rute seharusnya mempunyai session dari auth

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
