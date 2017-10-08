const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        vendor: [ // 第三方库可以统一放在这个入口一起合并
            'lodash'
    ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        hot: true,
        port: 9000
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },
  plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Shopping',
            filename: 'index.html'
        }),
        new webpack.ProvidePlugin({ // 设置全局变量
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin() // 用于开发环境，打印日志信息时 webpack 默认使用模块的数字 ID 指代模块，不便于 debug，这个插件可以将其替换为模块的真实路径
        //new webpack.HashedModuleIdsPlugin(), // 替换掉原来的`module.id`,用于生产环境
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common' // 抽取出的模块的模块名
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // 将 vendor 入口处的代码放入 vendor 模块,包含 vendor 的 CommonsChunkPlugin 实例必须在包含 runtime 的之前，否则会报错。
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime' // 将 webpack 自身的运行时代码放在 runtime 模块
        })
    ],
};