const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECTRET = "SWDCW";
const app = express();

app.use(express.json());
let users = [];

app.get("/", (req, res) => {
  res.sendFile( __dirname+ "/public/index.html"   );
});
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECTRET, (err, decoded) => {
      if (err) {
        res.json({
          message: "Invalid token",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.json({
      message: "No token",
    });
  }
}
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username,
    password,
  });
  res.json({ message: "success" });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  let founder = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      founder = users[i];
    }
  }
  if (!founder) {
    res.json({
      message: "user not found",
    });
    return;
  } else {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECTRET
    );
    res.json({
      message: "success",
      token,
    });
  }
});
app.get("/me", auth, (req, res) => {
  const user = users.find((u) => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    message: "User data retrieved successfully",
    username: user.username,
  });
});

app.listen(3000);
