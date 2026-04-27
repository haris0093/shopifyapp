import axios from "axios";

export default async function handler(req, res) {
  const shop = process.env.SHOP;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  // 👉 INSTALL ROUTE
  if (!req.query.code) {
    const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=read_products&redirect_uri=https://${req.headers.host}/api/index`;

    return res.redirect(installUrl);
  }

  // 👉 CALLBACK ROUTE
  try {
    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code,
      }
    );

    return res.send(`
      <h2>App Installed ✅</h2>
      <p><b>Access Token:</b></p>
      <code>${response.data.access_token}</code>
    `);
  } catch (err) {
    return res.status(500).send("Error generating token");
  }
}