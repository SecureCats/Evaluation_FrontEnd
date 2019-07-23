module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '//cdn.pes.fates.felinae98.cn/static/pes/' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist/pes' : 'dist',
  configureWebpack: { output: { globalObject: 'this' } }
}
