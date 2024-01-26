const fs = require("fs");
const path = require("path");
const parseCSV = require("../utils/parseCSV");

const mockCSVFilePath = path.join(__dirname, "mockData.csv");
const mockCSVContent = `name,age\nJane Will,30\nSteph Tayo,25`;

beforeAll(() => {
  // Creates a mock CSV file before all tests
  fs.writeFileSync(mockCSVFilePath, mockCSVContent);
});

afterAll(() => {
  // deletes the mock CSV file after all tests
  fs.unlinkSync(mockCSVFilePath);
});

describe("parseCSV", () => {
  test("correctly parses CSV file into JavaScript objects", async () => {
    const data = await parseCSV(mockCSVFilePath);

    // checks the structure and content of the parsed data
    expect(data).toEqual([
      { name: "Jane Will", age: "30" },
      { name: "Steph Tayo", age: "25" },
    ]);
  });
});
