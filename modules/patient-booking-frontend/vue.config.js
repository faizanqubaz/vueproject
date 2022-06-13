module.exports = {
  pages: {
    index: {
      entry: './src/main.ts',
      title: 'Welz'
    }
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
}
