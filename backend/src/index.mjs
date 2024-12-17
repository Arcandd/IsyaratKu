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
import cors from "cors";

const app = express();

app.use(cors());

app.set("json spaces", 2);

const secretKey = process.env.SECRET_KEY;
const PORT = process.env.PORT || 3000;
const atlasUri = process.env.ATLAS_URI;

mongoose
  .connect(atlasUri)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json({ limit: "10mb" }));
// app.use(cookieParser(secretKey)); // ! Gunakan jika aplikasi membutuhkan handling user preferences (theme, language) atau mentrack behaviour user
app.use(
  session({
    secret: secretKey, // ! Ini kaya password, harus yang tidak mudah ditebak
    saveUninitialized: false, // ? Jika di set ke true, maka semua session akan disimpan walaupun session tsb tidak di modifikasi
    resave: false, // ? jika di set true, maka setiap kali kita melakukan request, cookienya akan di save kembali, eg(waktunya dari 14.49.39 nambah jadi 14.49.41)
    cookie: {
      maxAge: 60000 * 60 * 24, // ? durasi session 1 hari
      secure: false,
      httpOnly: true,
      // secure: process.env.NODE_ENV, // ! ubah ke process.env.NODE_ENV ketika sudah production
    },
    // ? Agar user ttp login ketika app/server dimatikan
    store: MongoStore.create({
      // client: mongoose.connection.getClient(),
      mongoUrl: atlasUri,
      ttl: 1000 * 60 * 60 * 24, // ? 1 day
    }),
  })
); // ! Selalu declare session sebelum endpoint (routes)
app.use(passport.initialize()); // ! Selalu declare setelah session dan sebelum endpoint
app.use(passport.session()); // ? Karena kita sudah pake ini, semua rute seharusnya mempunyai session dari auth

app.use(routes);
