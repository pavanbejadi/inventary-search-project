const express = require("express");
const cors = require("cors");
const path = require("path");
const inventory = require("./data/inventory.json");

const app = express();
const PORT = 3000;

// CORS fix
app.use(cors());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// GET /search
app.get("/search", (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({
      message: "Invalid price range: minPrice cannot be greater than maxPrice.",
    });
  }

  let results = [...inventory];

  if (q && q.trim() !== "") {
    results = results.filter((item) =>
      item.productName.toLowerCase().includes(q.trim().toLowerCase()),
    );
  }

  if (category && category.trim() !== "") {
    results = results.filter(
      (item) => item.category.toLowerCase() === category.trim().toLowerCase(),
    );
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    results = results.filter((item) => item.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter((item) => item.price <= Number(maxPrice));
  }

  return res.json({ count: results.length, results });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
