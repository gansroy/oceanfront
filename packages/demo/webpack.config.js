const { resolve } = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  // devtool: 'inline-source-map',
  entry: resolve(__dirname, './src/main.ts'),
  output: {
    path: resolve(__dirname, './dist'),
    publicPath: '/dist/'
  },
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      //vue: '@vue/runtime-dom'
    }
  },
  module: {
    rules: [
      {
        // Load sourcemaps
        test: /\.(js|css)$/,
        loader: 'source-map-loader',
        include: /oceanfront[\\/]dist/,
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.png|\.woff|\.woff2$/,
        use: {
          loader: 'url-loader',
          options: { limit: 10000 }
        }
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !env.prod }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    /*new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!env.prod)
    }),*/
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    inline: false,
    hot: false,
    stats: 'minimal',
    contentBase: __dirname,
    overlay: true
  }
})
