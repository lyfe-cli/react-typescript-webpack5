/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob');
// const BundAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    runtimeChunk: true,
    moduleIds: 'deterministic',
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
      // new CssMinimizerPlugin({
      //   parallel: 4,
      // }),
    ],
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          // name: 'vendors', 一定不要定义固定的name
          priority: 10, // 优先级
          enforce: true
        }
      }
    }
  },
  plugins: [
    // 打包体积分析
    // new BundAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[hash].[name].css'
    })
    // CSS Tree Shaking
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${paths.appSrc}`,  { nodir: true }),
    // }),
  ]
});
