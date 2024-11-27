// app.get("/", (req, res) => {
//   console.log(req.session.id);
//   req.session.visited = true; // ? Agar jika cookie belum expired, tidak akan mbuat session id baru
//   res.cookie("hello", "world", { maxAge: 30000, signed: true });
//   res.status(200).send({ msg: "Hello, World" });
// });

// app.post("/api/auth", checkSchema(authValidationSchema), (req, res) => {
//   const result = validationResult(req);

//   if (!result.isEmpty())
//     return res.status(400).send({ errors: result.array() });

//   const data = matchedData(req); // ! Wajib pake ini kalau make validation schema
//   const findUser = mockUsers.find((user) => user.username === data.username);

//   if (!findUser || findUser.password !== data.password)
//     return res.status(401).send({ msg: "BAD CREDENTIALS" });

//   req.session.user = findUser; // ? .user adalah dynamic property

//   return res.status(200).send(findUser);
// });

// // ? Mengecek status auth dengan mengecek adanya cookie atau tidak
// app.get("/api/auth/status", (req, res) => {
//   req.sessionStore.get(req.sessionID, (err, session) => {
//     console.log(session);
//   });
//   return req.session.user
//     ? res.status(200).send(req.session.user)
//     : res.status(401).send({ msg: "Not Authenticated" });
// });

// app.post("/api/cart", (req, res) => {
//   if (!req.session.user) return res.sendStatus(401);

//   const { body: item } = req;
//   const { cart } = req.session;

//   if (cart) {
//     cart.push(item);
//   } else {
//     req.session.cart = [item];
//   }

//   return res.status(201).send(item);
// });

// app.get("/api/cart", (req, res) => {
//   if (!req.session.user) return res.sendStatus(401);

//   return res.send(req.session.cart ?? []); // ? "??" = else
// });