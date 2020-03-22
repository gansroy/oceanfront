const { resolve } = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

module.exports = (env = {}) => {
  let config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',
    entry: {
      index: resolve(__dirname, './src/index.ts')
    },
    output: {
      filename: '[name].[hash].js',
      path: resolve(__dirname, './dist'),
      publicPath: '/ofdocs/'
    },
    resolve: {
      extensions: ['.js', '.ts', '.vue'],
      alias: {
        // this isn't technically needed, since the default `vue` entry for bundlers
        // is a simple `export * from '@vue/runtime-dom`. However having this
        // extra re-export somehow causes webpack to always invalidate the module
        // on the first HMR update and causes the page to reload.
        //vue: '@vue/runtime-dom'

        '@': resolve('./src')
      }
    },
    module: {
      rules: [
        // {
        //   // Load sourcemaps
        //   test: /\.(js|css)$/,
        //   loader: 'source-map-loader',
        //   include: /oceanfront[\\/]dist/,
        //   enforce: 'pre'
        // },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { appendTsSuffixTo: [/\.vue$/] },
          exclude: /node_modules/
        },
        {
          test: /\.png|\.woff|\.woff2$/,
          use: {
            loader: 'url-loader',
            options: { limit: 15000 }
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: !isProd }
            },
            // 'vue-style-loader',
            'css-loader',
            'sass-loader'
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: !isProd }
            },
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProd)
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css'
      }),
      new HtmlPlugin({ template: 'src/index.html' })
    ],
    devServer: {
      inline: true,
      hot: true,
      overlay: true,
      stats: 'minimal',
      // contentBase: resolve(__dirname, './dist'),
      contentBasePublicPath: '/ofdocs/',
      watchContentBase: true // fix reload of html, bit drastic
    }
  }
  if (isProd) {
    config.optimization = {
      // usedExports: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          extractComments: true
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorOptions: {
            discardComments: { removeAll: true },
            postcssZindex: false,
            reduceIdents: false
          },
          canPrint: false
        })
      ]
    }
  }
  return config
}
