module.exports = {
  pages: {
    index: {
      entry: "./src/main.ts",
      title: "Welz OMS",
    },
  },
  transpileDependencies: ["vuetify"],
  pwa: {
    workboxOptions: {
      skipWaiting: true,
    },
  },
};
