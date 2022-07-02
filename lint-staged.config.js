module.exports = {
    // Run ESLint on changes to JavaScript/TypeScript files
    '**/*.(ts|js)?(x)': (filenames) => `pnpm lint . ${filenames.join(' ')}`,
};
