const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const express = require("express");
const app = express();
const port = 9000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

const dataFolderPath = path.join(__dirname, "data");

app.get("/", async (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
