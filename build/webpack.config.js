let path = require('path')
let webpack = require('webpack')
let config = require('./config')
let $util = require('./util')
var ejs = require('ejs')

module.exports = {
    entry: $util.getEntry,
    output: {
        path: config.distDir,
        filename: '[name].js',
        publicPath: '/dist/', // 默认为""
        // chunkFilename: '', // 指定非入口文件的输出名字
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'art-template-loader',
                options: {
                    imports: path.resolve(config.buildDir, 'template/art-helper.js')
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: '@q/qcdn-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(config.env),
        }),
        ...$util.getHtmlPlugin(),
    ],

    resolve: {
        alias: {
            '@': config.srcDir,
        },
    },

    externals: {
        jquery: 'window.jQuery',
    },

    target: 'web'
}

if (config.isProd) {
    module.exports.plugins = module.exports.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                screw_ie8: false, //关闭忽略对IE8的支持
                warnings: false
            }
        })
    ])
} else {
    module.exports.devtool = '#source-map'

    module.exports.devServer = {
        historyApiFallback: true,
        // contentBase: '', // 默认为 当前工作目录, process.cwd()
        publicPath: '/dist/', // 相当于指定了静态目录前缀，和output.publicPath一致
        inline: true,
        hot: true,
        port: config.port,
        // host: "0.0.0.0",
        disableHostCheck: true,

        // 注意before是在内部的中间件绑定之前先执行的
        // before: function (app) {
        //     app.set('views', path.resolve(config.viewDistDir));
        //     app.engine('html', ejs.__express);
        //     app.set('view engine', 'html');
        // }
    }
}
