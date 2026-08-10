require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const brandRoutes = require("./routes/brandRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");


const app = express();

app.use(cors());
app.use(express.json());

//Register auth routes
app.use("/api/auth", authRoutes);

//Register brand routes
app.use("/api/brands", brandRoutes);

//Register category routes
app.use("/api/categories", categoryRoutes);

//Register product routes
app.use("/api/products", productRoutes);



// Test database connection
pool.query("SELECT NOW()")
    .then(result => {
        console.log("✅ Database connected!");
        console.log(result.rows[0]);
    })
    .catch(err => {
        console.error("❌ Database connection error:", err);
    });

// Test route
app.get("/", (req, res) => {
    res.send("Welcome to StockPilot API");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});