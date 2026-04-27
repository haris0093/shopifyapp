import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const { SHOP, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

// 👉 Step 1: Install route
app.get("/", (req, res) => {
  const installUrl = `https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=read_products&redirect_uri=${REDIRECT_URI}`;
  res.redirect(installUrl);
});

// 👉 Step 2: Callback route
app.get("/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const response = await axios.post(
      `https://${SHOP}/admin/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }
    );

    res.send(`
      <h2>✅ App Installed Successfully</h2>
      <p><b>Access Token:</b></p>
      <code>${response.data.access_token}</code>
    `);
  } catch (err) {
    res.send("Error generating token");
  }
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});