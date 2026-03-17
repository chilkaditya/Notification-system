require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * SIGN UP
 */
app.post("/signup", async (req, res) => {
  try {
    console.log("reached")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    console.log(hashedPassword)
    const user = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
    [email, hashedPassword]
    );
    


    res.status(201).json({
      message: "User created",
      user: user.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * SIGN IN
 */
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update login count and last login time
    await pool.query(
      "UPDATE users SET login_count = COALESCE(login_count, 0) + 1, last_login = NOW() WHERE id = $1",
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PROTECTED ROUTE - Get User Info (with login count)
 */
app.get("/user-info", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, login_count, last_login FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


/**
 * JWT Middleware
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
