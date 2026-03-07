import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());

/* -------------------------------------------------------------------------- */
/*                         CUISINE → TEMPLATE MAP                             */
/* -------------------------------------------------------------------------- */

const CUISINE_TO_TEMPLATE_MAP = {
  "north indian": 1,
  "continental": 2,
  "italian": 3,
  "chinese": 4,
  "south indian": 5,
  "mughlai": 6,
  "mediterranean": 7,
  "japanese": 8,
  "ice cream": 9,
  "bakery": 10,
  "asian": 11,
  "thai": 12,
  "nepalese": 13,
  "fast food": 14,
  "portuguese": 15,
  "street food": 16,
  "cafe": 17,
  "desserts": 18,
  "vietnamese": 19,
  "european": 20,
  "afghan": 21,
  "rolls": 22,
  "kebab": 23,
  "finger food": 24,
  "biryani": 25,
  "momos": 26,
  "healthy food": 27,

  "starter": 1,
  "arabian": 6,
  "lebanese": 7,
  "kerala": 5,
  "andhra": 5,
  "salad": 27,
  "burger": 14,
  "beverages": 18,
  "mithai": 18,
  "bengali": 1,
  "chettinad": 5,
  "seafood": 11,
  "hyderabadi": 25,
};

/* -------------------------------------------------------------------------- */
/*                               SIGNUP                                       */
/* -------------------------------------------------------------------------- */

app.post("/api/signup", async (req, res) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required." });

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0)
      return res.status(409).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Signup successful",
      user: { id: insertResult.rows[0].id, username, email },
    });

  } catch (err) {

    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error." });

  }

});

/* -------------------------------------------------------------------------- */
/*                                 LOGIN                                      */
/* -------------------------------------------------------------------------- */

app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
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

    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });

  }

});

/* -------------------------------------------------------------------------- */
/*                           SAVE USER INFO                                   */
/* -------------------------------------------------------------------------- */

app.post("/api/saveUserInfo", async (req, res) => {

  const { email, firstName, lastName, dob, address, pincode, addressType } =
    req.body;

  if (!email) return res.status(400).send("Email is required");

  try {

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length === 0)
      return res.status(404).send("User not found");

    const userId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO user_info
      (user_id,first_name,last_name,dob,address,pincode,address_type)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        first_name=EXCLUDED.first_name,
        last_name=EXCLUDED.last_name,
        dob=EXCLUDED.dob,
        address=EXCLUDED.address,
        pincode=EXCLUDED.pincode,
        address_type=EXCLUDED.address_type`,
      [userId, firstName, lastName, dob, address, pincode, addressType]
    );

    res.send("User info saved successfully");

  } catch (err) {

    console.error("DB error:", err);
    res.status(500).send("DB error");

  }

});

/* -------------------------------------------------------------------------- */
/*                           GET USER DETAILS                                 */
/* -------------------------------------------------------------------------- */

app.get("/api/getUserDetails", async (req, res) => {

  const email = req.headers["x-user-email"];

  if (!email) return res.status(400).send("Email header is required");

  try {

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length === 0)
      return res.status(404).send("User not found");

    const userId = userResult.rows[0].id;

    const result = await pool.query(
      `SELECT CONCAT(first_name,' ',last_name) AS name,address
       FROM user_info WHERE user_id=$1`,
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(404).send("User info not found");

    res.json(result.rows[0]);

  } catch (err) {

    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });

  }

});

/* -------------------------------------------------------------------------- */
/*                          CITY RESTAURANTS                                  */
/* -------------------------------------------------------------------------- */

app.get("/api/home/:city", async (req, res) => {

  const city = req.params.city.toLowerCase();
  const validCities = ["delhi","kolkata","chennai","bangalore","mumbai"];

  if (!validCities.includes(city))
    return res.status(400).json({ message: "Invalid city" });

  try {

    const result = await pool.query(`SELECT * FROM ${city}`);

    const processedRows = result.rows.map((restaurant) => {

      const rawCuisine =
        restaurant.category ||
        restaurant.cuisine ||
        restaurant.cuisines ||
        "";

      const cuisineList = rawCuisine
        .split(",")
        .map((c) => c.trim().toLowerCase());

      let templateId = null;

      for (const cuisine of cuisineList) {

        if (CUISINE_TO_TEMPLATE_MAP[cuisine]) {
          templateId = CUISINE_TO_TEMPLATE_MAP[cuisine];
          break;
        }

        if (cuisine.includes("indian")) {
          templateId = cuisine.includes("south")
            ? CUISINE_TO_TEMPLATE_MAP["south indian"]
            : CUISINE_TO_TEMPLATE_MAP["north indian"];
          break;
        }

        if (cuisine.includes("biryani")) {
          templateId = CUISINE_TO_TEMPLATE_MAP["biryani"];
          break;
        }

      }

      if (!templateId) templateId = 1;

      return {
        ...restaurant,
        template_id: templateId,
      };

    });

    res.json(processedRows);

  } catch (err) {

    console.error("DB error:", err);
    res.status(500).json({ message: "DB error" });

  }

});

/* -------------------------------------------------------------------------- */
/*                           MENU ITEMS                                       */
/* -------------------------------------------------------------------------- */

app.get("/api/menu-items", async (req, res) => {

  const templateId = req.query.template_id;

  if (!templateId)
    return res.status(400).json({ error: "template_id required" });

  try {

    const result = await pool.query(
      `SELECT * FROM menu_items
       WHERE template_id=$1
       ORDER BY category,item_name`,
      [templateId]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("Menu fetch error:", err);
    res.status(500).json({ error: "Failed to fetch items" });

  }

});

/* -------------------------------------------------------------------------- */
/*                            PLACE ORDER                                     */
/* -------------------------------------------------------------------------- */

app.post("/api/placeOrder", async (req, res) => {

  const { email, orderList, paymentMode, totalPrice } = req.body;

  if (!email || !orderList || !paymentMode || !totalPrice)
    return res.status(400).json({ message: "Missing fields" });

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length === 0)
      throw new Error("User not found");

    const userId = userResult.rows[0].id;

    const infoRes = await client.query(
      `SELECT CONCAT(first_name,' ',last_name) AS user_name,address
       FROM user_info WHERE user_id=$1`,
      [userId]
    );

    if (infoRes.rows.length === 0)
      throw new Error("User info missing");

    const { user_name, address } = infoRes.rows[0];

    await client.query(
      `INSERT INTO orders
      (email,user_name,address,order_list,payment_mode,total_price)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        email,
        user_name,
        address,
        JSON.stringify(orderList),
        paymentMode,
        totalPrice,
      ]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Order placed successfully" });

  } catch (err) {

    await client.query("ROLLBACK");

    console.error("Transaction error:", err);

    res.status(500).json({
      message: err.message || "Order failed",
    });

  } finally {

    client.release();

  }

});

/* -------------------------------------------------------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});