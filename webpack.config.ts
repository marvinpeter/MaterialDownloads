import * as CopyWebpackPlugin from 'copy-webpack-plugin'
import * as path from 'path'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import { DefinePlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

const browsers = ['Chrome >= 75']

const rootDir = __dirname
const srcFolder = path.join(rootDir, 'src')
const distFolder = path.join(rootDir, 'dist')
const modulesFolder = path.join(rootDir, 'node_modules')

const isProduction = process.env.NODE_ENV === 'production'

// tslint:disable-next-line:readonly-array
const webpackPlugins: DefinePlugin[] = [
    new DefinePlugin({
        'isDebug': JSON.stringify(!isProduction)
    }),
    new HtmlWebpackPlugin({
        filename: '../views/popup.html',
        template: './src/views/popup/prerender.tsx',
        compile: true,
        inject: false
    }),
    new HtmlWebpackPlugin({
        filename: '../views/options.html',
        template: './src/views/options/prerender.tsx',
        compile: true,
        inject: false
    }),
    new CopyWebpackPlugin([
        {
            context: 'resources/',
            from: {
                glob: '**/*'
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
        },
        {
            from: isProduction
                ? 'node_modules/redux/dist/redux.min.js'
                : 'node_modules/redux/dist/redux.js',
            to: path.join(distFolder, 'scripts', 'redux.js'),
            toType: 'file'
        },
        {
            from: isProduction
                ? 'node_modules/react-redux/dist/react-redux.min.js'
                : 'node_modules/react-redux/dist/react-redux.js',
            to: path.join(distFolder, 'scripts', 'react-redux.js'),
            toType: 'file'
        },
        {
            from: isProduction
                ? 'node_modules/@material-ui/core/umd/material-ui.production.min.js'
                : 'node_modules/@material-ui/core/umd/material-ui.development.js',
            to: path.join(distFolder, 'scripts', 'material-ui.js'),
            toType: 'file'
        }
    ])
]

// tslint:disable-next-line:no-if-statement
if (isProduction) {
    // tslint:disable-next-line:no-expression-statement
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
        popup: './src/views/popup/index.tsx',
        background: './src/background.ts',
        options: './src/views/options/index.tsx'
    },

    output: {
        path: path.join(distFolder, 'scripts'),
        publicPath: '../dist',
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    externals: {
        //
        '@material-ui/core': 'material-ui',
        'redux': 'Redux',
        'react-redux': 'ReactRedux',
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: { /* Loader options go here */ }
            },

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
                    loader: 'ts-loader'
                }]
            }
        ]
    },

    plugins: webpackPlugins
}
