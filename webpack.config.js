const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const CompressionPlugin = require("compression-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackChunkHash = require("webpack-chunk-hash");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
let ckeditPath = path.join(__dirname, 'ckeditor')
let mathTypePath = path.join(__dirname, 'mathType')
var InlineEnvironmentVariablesPlugin = require('inline-environment-variables-webpack-plugin');
const isPro = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
let publicPath = '/';
let outPath = path.join(__dirname, 'server', isDev?  'dev':  isTest ? 'test':'public' , process.env.SUBJECT)

let extraPlugins = [];
let chunkhashPlaceholder = '';
let contenthashPlaceholder = '';

if (isPro) {
    //publicPath = '//sealimg.youneng.com/static/math/';
    extraPlugins = [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,    // 最紧凑的输出
            comments: false,    // 删除所有的注释
            sourceMap: true,
            compress: {
                warnings: false,        // 在UglifyJs删除没有用到的代码时不输出警告
                drop_console: true,     // 删除所有的 `console` 语句，可以兼容ie浏览器
                collapse_vars: true,    // 内嵌定义了但是只用到一次的变量
                reduce_vars: true,      // 提取出出现多次但是没有定义成变量去引用的静态值
            },
        }),
    ];
    //chunkhashPlaceholder = '[chunkhash:16].';
    //contenthashPlaceholder = '[contenthash:16].';
}

const rootAssetPath = path.resolve(__dirname, 'src');

const config = {
    context: rootAssetPath,
    resolve: {
        modules: [rootAssetPath,'node_modules'],
        extensions: [".js", ".jsx", ".json"],
    },
    entry: {
        portal: './js/portal.jsx',
        main: './js/main_entry.jsx',
        user: './js/user/entry.jsx',
    },
    output: {
        publicPath,
        path: outPath,
        filename: `[name].${chunkhashPlaceholder}js`,
        chunkFilename: `[name].${chunkhashPlaceholder}js`,
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: ckeditPath, to: path.join(outPath, 'ckeditor'), toType: 'dir'
            },
            {
                from: mathTypePath, to: path.join(outPath, 'mathType'), toType: 'dir'
            }
        ]),

        new webpack.NamedModulesPlugin(),
        new InlineEnvironmentVariablesPlugin(),
        /*new webpack.DefinePlugin({
            'process.env': {
                'SUBJECT': process.env.SUBJECT || 'math'
            }
        }),*/
        new WebpackChunkHash(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: `commons.${chunkhashPlaceholder}js`,
            minChunks: 2,
        }),
        new CleanWebpackPlugin(outPath),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bootstrap',
            filename: 'webpack_bootstrap.js',
            chunks: ['commons'],
        }),
        new ExtractTextPlugin(`[name].${contenthashPlaceholder}css`),
        new AssetsPlugin({
            filename: 'manifest.json',
            path: outPath,
            prettyPrint: true,
        })
    ].concat(extraPlugins),
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    },
                    {
                        loader: 'str-replace-loader',
                        options: {
                            // example result: `"version": "3.23.5"`
                            match: /<%([A-Z]+)%>/g ,
                            // use replace function instead of string
                            replace: (match, p1, p2, p3)=> `${process.env[p1]}`
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        `css-loader?-autoprefixer`
                    ],
                    publicPath,
                }),
                //include: /flexboxgrid/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        `css-loader?-autoprefixer`,
                        'resolve-url-loader',
                        'sass-loader?sourceMap',
                    ],
                    publicPath,
                }),
            },
            {
                test: /\.png|\.jpg|\.gif$/,
                use: "url-loader?limit=5000&name=img/[name].[hash:8].[ext]",
            },
        ],
    },
    externals: {
        mathjax: "MathJax",
        /*react: "React",
        "react-dom": "ReactDOM",*/
        // 'rctui': 'rctui',
        jquery: "jQuery",
        global: 'Global',
        immutable: "Immutable",
        kindeditor: "KindEditor",
        CKEDITOR: "CKEDITOR",
        echarts: "echarts",
        'raven-js': "Raven",
    },
    devtool: 'source-map',
    stats: {
        children: false,
    },
};

module.exports = config;
