function sanitizeDirKey(dirKey) {
  const normalizedDirKey = dirKey.replace(/\\/g, "/");

  // Remove leading relative path indicators
  const cleanedDirKey = normalizedDirKey
    .replace(/^(\.\.[\/])+/, "")
    .replace(/^(\.\/)+/, "");

  // Check if the cleaned path starts with 'data/' and remove it if present
  return cleanedDirKey.startsWith("data/")
    ? cleanedDirKey.substring(5)
    : cleanedDirKey;
}

module.exports = sanitizeDirKey;
