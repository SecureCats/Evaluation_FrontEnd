module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/static/pes/' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist/pes' : 'dist',
  configureWebpack: { output: { globalObject: 'this' } }
}
