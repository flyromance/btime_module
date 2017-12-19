let path = require('path')
let baseDir = path.resolve(__dirname, '..')
let srcDir = path.resolve(baseDir, 'src')
let distDir = path.resolve(baseDir, 'dist')
let buildDir = path.resolve(baseDir, 'build')
let viewSrcDir = path.resolve(baseDir, 'views_src')
let viewDir = path.resolve(baseDir, 'views')
let viewDistDir = path.resolve(distDir, 'views')

module.exports = {
    port: 8001,
    env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    isProd: process.env.NODE_ENV === 'production',
    baseDir,
    srcDir,
    distDir,
    buildDir,
    viewSrcDir,
    viewDir,
    viewDistDir,
}
