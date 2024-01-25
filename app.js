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

function readDirectories(dirPath) {
  let results = {};
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      Object.assign(results, readDirectories(fullPath));
    } else if (path.extname(file) === ".csv") {
      const dirKey = path.relative(dataFolderPath, dirPath);
      if (!results[dirKey]) {
        results[dirKey] = [];
      }
      results[dirKey].push(fullPath);
    }
  });

  return results;
}

const csvDirectories = readDirectories(dataFolderPath);

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

app.get("/", async (req, res) => {
  let allCsvDataArray = [];
  for (const [dirKey, filePaths] of Object.entries(csvDirectories)) {
    let filesData = [];
    for (const filePath of filePaths) {
      const data = await parseCSV(filePath);
      filesData.push({ fileName: path.basename(filePath), data: data });
    }
    let dirObject = {};
    dirObject[dirKey] = filesData;
    allCsvDataArray.push(dirObject);
  }

  let formattedData = {};

  allCsvDataArray.forEach((dirData) => {
    for (const [dirKey, files] of Object.entries(dirData)) {
      let parts = dirKey.split(path.sep);
      let rootFolder = parts[0];
      let folderName = parts[1];
      if (!formattedData[rootFolder]) {
        formattedData[rootFolder] = {};
      }
      formattedData[rootFolder][folderName] = files[0].data;
    }
  });

  res.render("index", { formattedData: formattedData });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
