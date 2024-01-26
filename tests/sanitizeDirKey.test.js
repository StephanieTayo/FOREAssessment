const sanitizeDirKey = require("../utils/sanitizeDirKey");

describe("sanitizeDirKey", () => {
  test("should normalize Windows path separators to Unix-like", () => {
    expect(sanitizeDirKey("path\\to\\directory")).toBe("path/to/directory");
  });

  test('should remove leading current directory indicator "./"', () => {
    expect(sanitizeDirKey("./path/to/directory")).toBe("path/to/directory");
  });

  test('should remove leading parent directory indicator "../"', () => {
    expect(sanitizeDirKey("../path/to/directory")).toBe("path/to/directory");
  });

  test('should remove "data/" prefix if present', () => {
    expect(sanitizeDirKey("data/path/to/directory")).toBe("path/to/directory");
  });

  test("should handle a combination of issues", () => {
    expect(sanitizeDirKey("../data\\path\\to\\directory")).toBe(
      "path/to/directory"
    );
  });

  test("should return the same path if no modifications are needed", () => {
    expect(sanitizeDirKey("path/to/directory")).toBe("path/to/directory");
  });
});
