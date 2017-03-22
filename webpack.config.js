const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const postcssSprites = require('postcss-sprites');
const sprites = postcssSprites.default;
const assets = require('postcss-assets');

const { NoEmitOnErrorsPlugin, LoaderOptionsPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin, SuppressExtractedTextChunksWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const entryPoints = [ "inline", "polyfills", "sw-register", "styles", "vendor", "main" ];
const baseHref = "/";
const deployUrl = "/";




module.exports = {
  "devtool": "source-map",
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules"
    ]
  },
  "resolveLoader": {
    "modules": [
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
      "./src/main.ts"
    ],
    "polyfills": [
      "./src/polyfills.ts"
    ],
    "styles": [
      "./src/styles.scss"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "publicPath": deployUrl,
    "filename": "js/[name].[chunkhash:20].bundle.js",
    "chunkFilename": "js/[id].[chunkhash:20].chunk.js"
  },
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
          /\/node_modules\//
        ]
      },
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader",
        "include": path.posix.join(__dirname, 'src/assets/images'),
        "query": {
          limit: 10000,
          name: 'images/[name].[hash:20].[ext]'
        }
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
          "postcss-loader"
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.less$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        "exclude": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.styl$/,
        "loaders": [
          "exports-loader?module.exports.toString()",
          "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
          "postcss-loader",
          "stylus-loader?{\"sourceMap\":true,\"paths\":[]}"
        ]
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.css$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
            "postcss-loader"
          ],
          "fallback": "style-loader",
          "publicPath": deployUrl
        })
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.scss$|\.sass$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
            "postcss-loader",
            "sass-loader"
          ],
          "fallback": "style-loader",
          "publicPath": deployUrl
        })
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.less$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
            "postcss-loader",
            "less-loader"
          ],
          "fallback": "style-loader",
          "publicPath": deployUrl
        })
      },
      {
        "include": [
          path.join(process.cwd(), "src/styles.scss")
        ],
        "test": /\.styl$/,
        "loaders": ExtractTextPlugin.extract({
          "use": [
            "css-loader?{\"sourceMap\":true,\"importLoaders\":1}",
            "postcss-loader",
            "stylus-loader?{\"sourceMap\":true,\"paths\":[]}"
          ],
          "fallback": "style-loader",
          "publicPath": deployUrl
        })
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new GlobCopyWebpackPlugin({
      "patterns": [
        // "assets",
        "favicon.ico"
      ],
      "globOptions": {
        "cwd": "/Users/jaylen/Desktop/workspace/plateno/PMS/angular2-pms/WeHotel-PMS/src",
        "dot": true,
        "ignore": "**/.gitkeep"
      }
    }),
    new ProgressPlugin(),
    new HtmlWebpackPlugin({
      "template": "./src/index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[ 0 ]);
        let rightindex = entryPoints.indexOf(right.names[ 0 ]);
        if (leftIndex > rightindex) {
          return 1;
        }
        else if (leftIndex < rightindex) {
          return -1;
        }
        else {
          return 0;
        }
      }
    }),
    new BaseHrefWebpackPlugin({
      "baseHref": "/"
    }),
    new CommonsChunkPlugin({
      "name": "inline",
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": "vendor",
      "minChunks": (module) => module.resource && module.resource.startsWith(nodeModules),
      "chunks": [
        "main"
      ]
    }),
    new ExtractTextPlugin({
      "filename": "css/[name].[contenthash:20].bundle.css",
      "disable": false
    }),
    new LoaderOptionsPlugin({
      "sourceMap": true,
      "options": {
        "postcss": [
          autoprefixer(),
          assets({
            loadPath: [ 'src/assets/images', 'src/assets/images/sprites' ]
          }),
          postcssUrl({
            "url": (URL) => {
              // Only convert absolute URLs, which CSS-Loader won't process into require().
              if (!URL.startsWith('/')) {
                return URL;
              }
              // Join together base-href, deploy-url and the original URL.
              // Also dedupe multiple slashes into single ones.
              return `/${baseHref || ''}/${deployUrl || ''}/${URL}`.replace(/\/\/+/g, '/');
            }
          }),
          postcssSprites({
            // stylesheetPath: './dist/css/',
            spritePath: './src/assets/images/sprites',
            padding: 3,
            filterBy: function (image) {
              if (/\/images\/sprites\//gi.test(image.url)) {
                return Promise.resolve();
              }
              return Promise.reject();
            }
          })
        ],
        "sassLoader": {
          "sourceMap": true,
          "includePaths": []
        },
        "lessLoader": {
          "sourceMap": true
        },
        "context": ""
      }
    }),
    new SuppressExtractedTextChunksWebpackPlugin(),
    new AotPlugin({
      "mainPath": "main.ts",
      "hostReplacementPaths": {
        "environments/environment.ts": "environments/environment.ts"
      },
      "exclude": [],
      "tsConfigPath": "src/tsconfig.app.json"
    }),
    // 压缩js
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: { warnings: false }
    }),
    // 压缩css
    new OptimizeCSSPlugin(),
    // 对js和css进行gzip压缩
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  }
};
