const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  pages: {
    index: {
      entry: "./src/main.ts",
      title: "Welz",
    },
  },
  transpileDependencies: true,
});
