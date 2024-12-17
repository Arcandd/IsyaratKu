import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/crypting/hashPassword.mjs";

// ! Gunakan {usernameField: "(email), (dkk)"} jika ingin login menggunakan email or dkk
// passport.use(
//   new Strategy({ usernameField: "email" }, (username, password, done) => {})
// );

// ? Ketika user berhasil melakukan login, kode ini akan menyimpan informasi user ke dalam session (user.id) << ini adalah identifier
passport.serializeUser((user, done) => {
  console.log("Inside Serialize");
  console.log(`User logged in: ${user.username}, ID: ${user.id}`);
  done(null, user.id); // ? Menyimpan user.id ke dalam session daripada objek user penuh
});

// ? DeserializeUser akan mengambil identifier yang tersimpan dalam session ketika request dilakukan.
passport.deserializeUser(async (id, done) => {
  console.log(`Inside Deserialized`);
  console.log(`Deserializing User ID: ${id}`);
  try {
    const findUser = await User.findById(id);

    if (!findUser) throw new Error("User not found");

    done(null, findUser); // ? fungsi ini dipanggil agar data user tersedia di req.user
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  "local-login", // ? nama unik buat setiap strategy
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username }); // ! User.findOne bersifat asynchronous, jadi harus dikasi await karena itu mengembalikan promise, jadi tidak bisa langsung mengakses findUser.password seperti synchronous object

      if (!findUser) return done(null, false, { errors: "Incorrect username!" });
      if (!comparePassword(password, findUser.password))
        return done(null, false, { errors: "Incorrect password!" });

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
