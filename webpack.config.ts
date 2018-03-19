import * as path from 'path'
import { NamedModulesPlugin, optimize, DefinePlugin, SplitChunksPlugin } from 'webpack'
import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'

import * as postcssCssNext from 'postcss-cssnext'
import * as postcssNestedAncestors from 'postcss-nested-ancestors'
import * as postcssClean from 'postcss-clean'

const browsers = ['Chrome >= 60']

const rootDir = __dirname
const srcFolder = path.join(rootDir, 'src')
const distFolder = path.join(rootDir, 'dist')
const modulesFolder = path.join(rootDir, 'node_modules')

const isProduction = process.env.NODE_ENV === 'production'

const postcssPlugins = [
    postcssNestedAncestors(),
    postcssCssNext({ browsers })
]

const webpackPlugins: DefinePlugin[] = [
    new DefinePlugin({
        'isDebug': JSON.stringify(!isProduction)
    }),
    new ExtractTextPlugin('../styles/[name].css'),
    new CopyWebpackPlugin([
        {
            context: 'src/',
            from: {
                glob: '**/*.{html,png,json}'
            },
            to: distFolder
        },
        {
            from: isProduction
                ? 'node_modules/react/umd/react.production.min.js'
                : 'node_modules/react/umd/react.development.js',
            to: path.join(distFolder, 'scripts', 'react.js'),
            toType: 'file'
        },
        {
            from: isProduction
                ? 'node_modules/react-dom/umd/react-dom.production.min.js'
                : 'node_modules/react-dom/umd/react-dom.development.js',
            to: path.join(distFolder, 'scripts', 'react-dom.js'),
            toType: 'file'
        }
    ])
]

if (isProduction) {
    postcssPlugins.push(postcssClean())
    webpackPlugins.push(new UglifyJsPlugin() as any)
}

export default {
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        modules: [srcFolder, modulesFolder],
    },

    devtool: isProduction ? '' : 'source-map',

    target: 'web',

    mode: isProduction ? 'production' : 'development',

    entry: {
        popup: './src/popup.tsx',
        background: './src/background.ts',
        options: './src/options.tsx'
    },

    output: {
        path: path.join(distFolder, 'scripts'),
        publicPath: '../dist',
        filename: '[name].js'
    },

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                helpers: {
                    name: 'helpers',
                    chunks: 'initial',
                    test: /helpers/,
                    enforce: true
                },
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    test: /node_modules/,
                    enforce: true
                }
            }
        }
    },

    module: {
        rules: [
            // Compile TypeScript React files
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                targets: { browsers },
                                modules: false,
                                useBuiltIns: true
                            }]
                        ]
                    }
                }, {
                    loader: 'awesome-typescript-loader'
                }]

            },

            // Extract all .global.css to style.css
            {
                test: /\.global\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssPlugins
                        }
                    }]
                })
            },

            // Pipe other styles through css modules and append to style.css
            {
                test: /^((?!\.global).)*\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: true,
                            sourceMap: true,
                            namedExport: true,
                            importLoaders: 1,
                            camelCase: true,
                            localIdentName: '[local]_[hash:base64:8]',
                            minimize: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssPlugins
                        }
                    }]
                })
            },
        ]
    },

    plugins: webpackPlugins
}
