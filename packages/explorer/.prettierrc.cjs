const baseConfig = require("../../.prettierrc.cjs");

/** @type {import('prettier').Config} */
module.exports = {
  ...baseConfig,
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: ["^[react]", "^@(?!/)", "^@/", "^[./]"],
};
