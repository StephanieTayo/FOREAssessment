const readDirectories = require("../utils/readDirectories");
const fs = require("fs");
const path = require("path");

function createTestDirStructure(baseDir, structure) {
  fs.mkdirSync(baseDir, { recursive: true });
  structure.forEach((item) => {
    const itemPath = path.join(baseDir, item.name);
    if (item.type === "dir") {
      fs.mkdirSync(itemPath, { recursive: true });
      if (item.children) {
        createTestDirStructure(itemPath, item.children);
      }
    } else if (item.type === "file") {
      fs.writeFileSync(itemPath, "test content");
    }
  });
}

describe("readDirectories", () => {
  const baseDir = path.join(__dirname, "data");

  beforeAll(() => {
    const structure = [
      {
        name: "dir1",
        type: "dir",
        children: [
          { name: "file1.csv", type: "file" },
          { name: "file2.txt", type: "file" },
        ],
      },
      {
        name: "dir2",
        type: "dir",
        children: [{ name: "file3.csv", type: "file" }],
      },
    ];
    createTestDirStructure(baseDir, structure);
  });

  afterAll(() => {
    fs.rmSync(baseDir, { recursive: true, force: true });
  });

  test("should correctly read .csv files from directories", () => {
    const results = readDirectories(baseDir);

    const expected = {
      [path.join("..", "..", "tests", "data", "dir1")]: [
        path.resolve(baseDir, "dir1", "file1.csv"),
      ],
      [path.join("..", "..", "tests", "data", "dir2")]: [
        path.resolve(baseDir, "dir2", "file3.csv"),
      ],
    };

    expect(results).toEqual(expected);
  });
});
