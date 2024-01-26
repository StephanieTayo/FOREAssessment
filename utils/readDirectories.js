const fs = require("fs");
const path = require("path");

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

module.exports = readDirectories;
