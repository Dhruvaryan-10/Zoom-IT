import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------------------- */
/*                                   CORS                                     */
/* -------------------------------------------------------------------------- */

app.use(
  cors({
  origin: [
    "http://localhost:5174",
    "https://zoom-it.vercel.app"
  ],
  credentials: true
})
);

app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                               HEALTH CHECK                                 */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.send("ZoomIT API running 🚀");
});

/* -------------------------------------------------------------------------- */
/*                       CUISINE → TEMPLATE MAP                               */
/* -------------------------------------------------------------------------- */

const CUISINE_TO_TEMPLATE_MAP = {
  "north indian": 1,
  continental: 2,
  italian: 3,
  chinese: 4,
  "south indian": 5,
  mughlai: 6,
  mediterranean: 7,
  japanese: 8,
  "ice cream": 9,
  bakery: 10,
  asian: 11,
  thai: 12,
  nepalese: 13,
  "fast food": 14,
  portuguese: 15,
  "street food": 16,
  cafe: 17,
  desserts: 18,
  vietnamese: 19,
  european: 20,
  afghan: 21,
  rolls: 22,
  kebab: 23,
  "finger food": 24,
  biryani: 25,
  momos: 26,
  "healthy food": 27,
};

/* -------------------------------------------------------------------------- */
/*                                  SIGNUP                                    */
/* -------------------------------------------------------------------------- */

app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required." });

    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length)
      return res.status(409).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Signup successful",
      user: { id: result.rows[0].id, username, email },
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error." });
  }
});

/* -------------------------------------------------------------------------- */
/*                                   LOGIN                                    */
/* -------------------------------------------------------------------------- */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!result.rows.length)
      return res.status(401).json({ message: "User not found." });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Invalid password." });

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, username: user.username },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error." });
  }
});

/* -------------------------------------------------------------------------- */
/*                             GET USER DETAILS                               */
/* -------------------------------------------------------------------------- */

app.get("/api/getUserDetails", async (req, res) => {
  try {

    const email = req.headers["x-user-email"];

    if (!email)
      return res.json({ name: "User", address: "" });

    const user = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (!user.rows.length)
      return res.json({ name: "User", address: "" });

    const userId = user.rows[0].id;

    const info = await pool.query(
      "SELECT first_name,last_name,address FROM user_info WHERE user_id=$1",
      [userId]
    );

    if (!info.rows.length)
      return res.json({ name: "User", address: "" });

    const row = info.rows[0];

    res.json({
      name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      address: row.address || "",
    });

  } catch (err) {
    console.error("USER DETAILS ERROR:", err);
    res.json({ name: "User", address: "" });
  }
});

/* -------------------------------------------------------------------------- */
/*                            CITY RESTAURANTS                                */
/* -------------------------------------------------------------------------- */

app.get("/api/home/:city", async (req, res) => {
  try {

    const city = req.params.city.toLowerCase();

    const tableMap = {
      delhi: "delhi",
      bangalore: "bangalore",
      chennai: "chennai",
      kolkata: "kolkata",
      mumbai: "mumbai",
    };

    const table = tableMap[city];

    if (!table)
      return res.status(400).json({ message: "Invalid city" });

    const result = await pool.query(
      `SELECT * FROM ${table} LIMIT 1000`
    );

    const processedRows = result.rows.map((restaurant) => {

      const rawCuisine =
        restaurant.category ||
        restaurant.cuisine ||
        restaurant.cuisines ||
        "";

      const cuisineList = rawCuisine
        .split(",")
        .map((c) => c.trim().toLowerCase());

      let templateId = 1;

      for (const cuisine of cuisineList) {
        if (CUISINE_TO_TEMPLATE_MAP[cuisine]) {
          templateId = CUISINE_TO_TEMPLATE_MAP[cuisine];
          break;
        }
      }

      return {
        ...restaurant,
        template_id: templateId,
      };

    });

    res.json(processedRows);

  } catch (err) {

    console.error("HOME API ERROR:", err);

    res.status(500).json({
      message: "DB error",
      error: err.message,
    });

  }
});

/* -------------------------------------------------------------------------- */
/*                               MENU ITEMS                                   */
/* -------------------------------------------------------------------------- */

app.get("/api/menu-items", async (req, res) => {
  try {

    const templateId = req.query.template_id;

    if (!templateId)
      return res.status(400).json({ error: "template_id required" });

    const result = await pool.query(
      `SELECT * FROM menu_items
       WHERE template_id=$1
       ORDER BY category,item_name`,
      [templateId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("MENU FETCH ERROR:", err);

    res.status(500).json({
      error: "Menu fetch failed",
      details: err.message
    });

  }
});

/* -------------------------------------------------------------------------- */
/*                                PLACE ORDER                                 */
/* -------------------------------------------------------------------------- */

app.post("/api/placeOrder", async (req, res) => {
  try {

    const { email, orderList, paymentMode, totalPrice } = req.body;

    if (!email || !orderList || !paymentMode || !totalPrice) {
      return res.status(400).json({ message: "Missing order fields" });
    }

    const user = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user.rows[0].id;

    const info = await pool.query(
      "SELECT first_name,last_name,address FROM user_info WHERE user_id=$1",
      [userId]
    );

    const name =
      info.rows.length
        ? `${info.rows[0].first_name} ${info.rows[0].last_name}`
        : "User";

    const address =
      info.rows.length
        ? info.rows[0].address
        : "Address not set";

    await pool.query(
      `INSERT INTO orders
      (email,user_name,address,order_list,payment_mode,total_price)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        email,
        name,
        address,
        JSON.stringify(orderList),
        paymentMode,
        totalPrice
      ]
    );

    res.json({
      message: "Order placed successfully"
    });

  } catch (err) {

    console.error("ORDER ERROR:", err);

    res.status(500).json({
      message: "Order failed",
      error: err.message
    });

  }
});
/* -------------------------------------------------------------------------- */
/*                                SERVER                                      */
/* -------------------------------------------------------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});