/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const path = require('path');
const paths = require('./paths');

const formatTime = date => `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;

const ctx = {
  isEnvDevelopment: process.env.NODE_ENV === 'development',
  isEnvProduction: process.env.NODE_ENV === 'production'
};

const { isEnvDevelopment, isEnvProduction } = ctx;

module.exports = {
  entry: {
    index: './src/index.tsx'
  },
  output: {
    clean: true,
    filename: ctx.isEnvProduction ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
    path: paths.appDist,
    assetModuleFilename: 'assets/[name]_[hash][ext]'
  },
  resolve: {
    enforceExtension: false,
    alias: {
      '@': paths.appSrc
    },
    extensions: ['.tsx', '.ts', '.js', '.less'],
    modules: ['node_modules', paths.appSrc],
    symlinks: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'LYFE-CLI',
      template: 'index.html',
      filename: 'index.html',
      buildTime: `${formatTime(new Date())}`
    }),
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:3001']
      },
      clearConsole: true
    })
    // new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: paths.appSrc,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name]_[hash][ext]' // 独立的配置
        }
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/i,
        include: paths.appSrc,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name]_[hash][ext]'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/i,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']]
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [
                  path.resolve(__dirname, './src'),
                  path.resolve(__dirname, './node_modules/antd')
                ],
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015'
            }
          }
        ]
      }
    ]
  },
  target: isEnvDevelopment ? 'web' : 'browserslist',
  cache: {
    type: 'filesystem'
  }
};
