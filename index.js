require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000;
const PART_SERVICE_KEY = process.env.X_PART_SERVICE_KEY;

if (!PART_SERVICE_KEY) {
  console.error("❌ Missing API Key (X_PART_SERVICE_KEY) in .env file!");
  process.exit(1);
}

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get(
  "/api/proxy/:region?/:autotype?/:year?/:make?/:model?/:submodel?",
  async (req, res) => {
    try {
      const { region, autotype, year, make, model, submodel } = req.params;

      const baseUrl = "https://api.xpel.com/partsearch/search";
      const params = [region, autotype, year, make, model, submodel].filter(
        Boolean
      );
      const apiUrl = `${baseUrl}/${params.join("/")}`;
      console.log(`📡 Fetching API: ${apiUrl}`);

      const response = await axios.get(apiUrl, {
        headers: {
          "X-PartServiceKey": PART_SERVICE_KEY,
          Accept: "application/json",
        },
      });

      res.json(response.data);
    } catch (error) {
      console.error("❌ API Request Failed:", error.message);
      res.status(500).json({
        error: "Failed to fetch data from API.",
        details: error.response?.data || error.message,
      });
    }
  }
);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
