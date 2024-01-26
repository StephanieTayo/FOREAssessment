const path = require("path");
const express = require("express");
const app = express();
const readDirectories = require("./utils/readDirectories");
const parseCSV = require("./utils/parseCSV");
const sanitizeDirKey = require("./utils/sanitizeDirKey");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

const dataFolderPath = path.join(__dirname, "data");
const csvDirectories = readDirectories(dataFolderPath);

app.get("/", async (req, res) => {
  let allCsvDataArray = [];
  for (const [originalDirKey, filePaths] of Object.entries(csvDirectories)) {
    let filesData = [];
    for (const filePath of filePaths) {
      const data = await parseCSV(filePath);
      filesData.push({ fileName: path.basename(filePath), data: data });
    }
    const dirKey = sanitizeDirKey(originalDirKey);

    let dirObject = {};
    dirObject[dirKey] = filesData;
    allCsvDataArray.push(dirObject);
  }

  let formattedData = {};

  allCsvDataArray.forEach((dirData) => {
    for (const [dirKey, files] of Object.entries(dirData)) {
      const parts = dirKey.split(/[/\\]/);
      let rootFolder = parts[0];
      let folderName = parts.length > 1 ? parts[1] : "";
      if (!formattedData[rootFolder]) {
        formattedData[rootFolder] = {};
      }
      formattedData[rootFolder][folderName] =
        files.length > 0 ? files[0].data : [];
    }
  });

  res.render("index", { formattedData: formattedData });
});

module.exports = app;
