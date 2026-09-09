/** Normalize email for lookup/storage so login matches Mongoose lowercase saves. */
function normalizeEmail(email) {
  return String(email ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKC');
}

module.exports = { normalizeEmail };
