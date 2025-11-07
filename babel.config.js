module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    ["@babel/plugin-transform-class-properties", { loose: true }],
    ["@babel/plugin-transform-private-methods", { loose: true }],
    ["@babel/plugin-transform-private-property-in-object", { loose: true }],
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env",
      },
    ],
    // 👇 Reanimated plugin tek başına yeterli, en sonda olacak
    "react-native-reanimated/plugin",
  ],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
};
