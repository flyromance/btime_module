var config = require('./config')
var glob = require('glob')
var path = require('path')
let router = require('express').Router()
let url = require('url')
let HtmlWebpackPlugin = require('html-webpack-plugin')

exports.getEntry = function () {
    var entries = glob.sync(path.join(config.srcDir, 'entry/*/*.js'))
    var entry = {};
    var reg = /src\/entry\/(.+)\.js$/;
    entries.forEach(function (filepath, index) {
        var match = filepath.match(reg);
        if (match) {
            entry[match[1]] = filepath;
        }
    })
    return entry;
}

exports.getHtmlPlugin = function () {
    var ret = []
    var arr = glob.sync(path.join(config.srcDir, 'entry/*/*.html'))
    var reg = /src\/entry\/(.+)\.html$/
    arr.forEach((item, i) => {
        var match = item.match(reg)
        if (match) {
            var filename = ''
            // 不同的环境用不用的filename，也就是打包到不同的地方
            if (config.isProd) {
                filename = path.join(config.viewDir, match[1] + '.html') // 生产环境输出到单独的目录，给server端调用
            } else {
                filename = path.join(config.viewDistDir, match[1] + '.html') // 开发环境，输出到output.path指定的目录中，因为只有在这个目录，内存中才有
                console.log(filename)
            }

            ret.push(new HtmlWebpackPlugin({
                template: item,
                filename: filename,
                inject: false,
                chunks: [match[1]],
            }))
        } 
    })
    return ret
}

exports.getRouter = function () {
    // 匹配 /feed.html /xxx.html
    router.get(/\/[\w\/-]+\.html/, function (req, res) {
        // 原生的req上是没有 'path' 这个属性的，只有url, 并且这个path就是路由匹配的结果
        var page_name = req.path.replace(/\.html.*$/, '').slice(1) // 去掉/
        res.render(page_name)
    })

    return router
}

exports.getFiles = function() {
    var files = glob.sync(path.join(config.distDir, '*/*.js'))
    return files;
}
