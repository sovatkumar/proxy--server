const express = require("express");
const axios = require("axios");
const app = express();

app.get(
  "/api/proxy/:region/:autotype/:year?/:make?/:model?/:submodel?",
  async (req, res) => {
    try {
      // Extract parameters from the request
      const { region, autotype, year, make, model, submodel } = req.params;

      // Construct the API URL dynamically
      let apiUrl = `https://api.xpel.com/partsearch/search/${region}/${autotype}`;

      // Append optional parameters in correct order if they exist
      if (year) apiUrl += `/${year}`;
      if (make) apiUrl += `/${make}`;
      if (model) apiUrl += `/${model}`;
      if (submodel) apiUrl += `/${submodel}`;

      // Make API request
      const response = await axios.get(apiUrl, {
        headers: {
          "X-PartServiceKey": "Driven02032025",
          "Content-Type": "application/json",
        },
      });

      res.json(response.data);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch data",
        details: error.message,
      });
    }
  }
);

app.listen(5000, () => console.log("Server running on port 5000"));
