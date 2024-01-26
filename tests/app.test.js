const request = require("supertest");
const app = require("../app");

jest.mock("../utils/readDirectories", () => {
  return jest.fn(() => ({
    dir1: ["path/to/csv1.csv", "path/to/csv2.csv"],
    dir2: ["path/to/csv3.csv"],
  }));
});

jest.mock("../utils/parseCSV", () => {
  return jest.fn((filePath) =>
    Promise.resolve([{ column1: "value1", column2: "value2" }])
  );
});

jest.mock("../utils/sanitizeDirKey", () => {
  return jest.fn((dirKey) => dirKey.replace(/\W+/g, "_"));
});

describe("GET /", () => {
  it("responds with formatted data", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("text/html");
  });
});
