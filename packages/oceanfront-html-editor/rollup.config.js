import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import cssnano from 'cssnano'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import url from '@rollup/plugin-url'
import vue from 'rollup-plugin-vue'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const projectRoot = path.resolve(__dirname, '.')
const external = ['vue']
const globals = { vue: 'Vue' }
const node_env = process.env.NODE_ENV || 'development'

// Customize configs for individual targets
const buildFormats = []
const targetFormats = {
  dts: !argv.format || argv.format == 'dts' || argv.format == 'es',
  es: !argv.format || argv.format == 'es',
  iife: !argv.format || argv.format == 'iife',
  cjs: !argv.format || argv.format == 'cjs',
}

const postcssPlugins = [
  postcssImport({
    resolve(id, basedir) {
      // resolve alias @css, @import '@css/style.css'
      // because @css/ has 5 chars
      // if (id.startsWith("@css")) {
      //   return path.resolve("./src/assets/styles/css", id.slice(5));
      // }

      // resolve node_modules, @import '~normalize.css/normalize.css'
      // similar to how css-loader's handling of node_modules
      if (id.startsWith('~')) {
        return path.resolve('./node_modules', id.slice(1))
      }

      // resolve relative path, @import './components/style.css'
      return path.resolve(basedir, id)
    },
  }),
  postcssUrl({ url: 'inline' }),
]

function pluginConfig(compact, extractCss) {
  const ret = [
    alias({
      entries: [
        {
          find: '@',
          replacement: path.resolve(projectRoot, 'src'),
        },
      ],
      customResolver: resolve({
        extensions: ['.js', '.jsx', '.vue'],
      }),
    }),
    resolve({
      extensions: ['.js', '.jsx', '.vue'],
    }),
    vue({
      target: 'browser',
      preprocessStyles: true,
      postcssPlugins: [...postcssPlugins],
    }),
    typescript({
      clean: true,
      tsconfigOverride: {
        declaration: false,
        declarationDir: null,
        declarationMap: false,
      },
    }),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(node_env),
      __DEV__: JSON.stringify(node_env === 'development'),
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    }),
    postcss({
      extract: extractCss ? 'oceanfront-html-editor.css' : false,
      inject: false,
      plugins: [...postcssPlugins, cssnano()],
      sourceMap: true,
    }),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
    }),
  ]

  const babelCfg = {
    babelrc: false,
    exclude: 'node_modules/**',
    extensions: ['.js', '.ts', '.vue'],
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env'],
  }
  ret.push(babel(babelCfg))

  if (compact) {
    ret.push(
      terser({
        output: {
          ecma: 5,
        },
      })
    )
  }
  return ret
}

if (targetFormats.dts) {
  buildFormats.push({
    input: `src/index.ts`,
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
    external: [/\.scss$/],
    plugins: [dts()],
  })
}

if (targetFormats.es) {
  buildFormats.push({
    input: 'src/index.ts',
    external,
    output: {
      format: 'esm',
      file: 'dist/oceanfront-html-editor.esm.js',
    },
    plugins: pluginConfig(false, true),
  })
}

if (targetFormats.iife) {
  buildFormats.push({
    input: './src/index.ts',
    external,
    output: {
      compact: true,
      file: 'dist/oceanfront-html-editor-browser.min.js',
      format: 'iife',
      name: 'oceanfront-html-editor',
      exports: 'named',
      globals,
    },
    plugins: pluginConfig(true),
  })
}

if (targetFormats.cjs) {
  buildFormats.push({
    input: './src/index.ts',
    external,
    output: {
      compact: true,
      format: 'cjs',
      file: 'dist/oceanfront-html-editor.cjs.js',
      exports: 'named',
      globals,
    },
    plugins: pluginConfig(),
  })
}

export default buildFormats
