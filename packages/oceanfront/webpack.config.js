const { resolve } = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
const version = process.env.VERSION || require('./package.json').version

module.exports = (env = {}) => {
  let config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',
    entry: {
      oceanfront: './src/index.ts',
    },
    externals: {
      vue: { commonjs: 'vue', commonjs2: 'vue' },
      'vue-router': { commonjs: 'vue-router', commonjs2: 'vue-router' },
    },
    output: {
      path: resolve('./dist'),
      publicPath: '/dist/',
      library: 'Oceanfront',
      libraryTarget: 'umd',
      // libraryExport: 'default',
      filename: isProd ? '[name].min.js' : '[name].js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.vue'],
      alias: {
        // this isn't technically needed, since the default `vue` entry for bundlers
        // is a simple `export * from '@vue/runtime-dom`. However having this
        // extra re-export somehow causes webpack to always invalidate the module
        // on the first HMR update and causes the page to reload.
        //vue: '@vue/runtime-dom'

        oceanfront: resolve('./src'),
        '@': resolve('./src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] },
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: !isProd },
            },
            // 'vue-style-loader',
            'css-loader',
            // 'resolve-url-loader',
            'sass-loader',
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: !isProd },
            },
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProd),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new CopyPlugin([{ from: 'src/global.d.ts', to: 'oceanfront.d.ts' }]),
    ],
    devServer: {
      inline: true,
      hot: true,
      historyApiFallback: true,
      stats: 'minimal',
      contentBase: __dirname,
      overlay: true,
    },
    node: {
      fs: 'empty',
    },
    performance: {
      hints: false,
    },
    stats: { children: false },
  }
  if (isProd) {
    config.plugins = config.plugins.concat([
      new webpack.BannerPlugin({
        banner: `/*!
* Oceanfront v${version}
* Copyright 2020 1CRM Systems Corp.
* Released under the MIT License.
*/     `,
        raw: true,
        entryOnly: true,
      }),
    ])
    config.optimization = {
      // usedExports: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          extractComments: true,
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorOptions: {
            discardComments: { removeAll: true },
            postcssZindex: false,
            reduceIdents: false,
          },
          canPrint: false,
        }),
      ],
    }
  }
  return config
}
