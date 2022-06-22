export default {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-wiffleball`
  extends: ['wiffleball'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
};
