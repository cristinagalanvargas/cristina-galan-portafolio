const config = {
  "*.{ts,tsx,mjs,js}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"],
};

export default config;
