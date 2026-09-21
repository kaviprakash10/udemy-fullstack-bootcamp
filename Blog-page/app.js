const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/", blogRoutes);

// 404 Catch-all Handler
app.use((req, res) => {
  res.status(404).render("404", {
    message: "The page you are looking for does not exist or has been moved."
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Blog application running at http://localhost:${PORT}`);
});
