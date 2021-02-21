import path from "path";
import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const projectRoot = path.resolve(__dirname, ".");
const external = ["oceanfront", "vue-router"];
const globals = { oceanfront: "Oceanfront", "vue-router": "VueRouter" };
const node_env = process.env.NODE_ENV || "development";

// Customize configs for individual targets
const buildFormats = [];
const targetFormats = {
  dts: !argv.format || argv.format == "dts" || argv.format == "es",
  es: !argv.format || argv.format == "es",
  iife: !argv.format || argv.format == "iife",
  cjs: !argv.format || argv.format == "cjs",
};

function pluginConfig(compact, extractCss) {
  const ret = [
    alias({
      entries: [
        {
          find: "@",
          replacement: path.resolve(projectRoot, "src"),
        },
      ],
      customResolver: resolve({
        extensions: [".js", ".jsx"],
      }),
    }),
    resolve({
      extensions: [".js", ".jsx"],
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
      "process.env.NODE_ENV": JSON.stringify(node_env),
      __DEV__: JSON.stringify(node_env === "development"),
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    }),
  ];

  const babelCfg = {
    babelrc: false,
    exclude: "node_modules/**",
    extensions: [".js", ".ts", ".vue"],
    babelHelpers: "bundled",
    presets: ["@babel/preset-env"],
  };
  ret.push(babel(babelCfg));

  if (compact) {
    ret.push(
      terser({
        output: {
          ecma: 5,
        },
      })
    );
  }
  return ret;
}

if (targetFormats.dts) {
  buildFormats.push({
    input: `src/index.ts`,
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
    external: [/\.scss$/],
    plugins: [dts()],
  });
}

if (targetFormats.es) {
  /*
  buildFormats.push({
    input: {
      index: './src/index.ts',
    },
    external,
    output: {
      format: 'esm',
      dir: 'dist/esm',
    },
    plugins: pluginConfig(),
  })
  */

  buildFormats.push({
    input: "src/index.ts",
    external,
    output: {
      format: "esm",
      file: "dist/oceanfront-vue-router.esm.js",
    },
    plugins: pluginConfig(false, true),
  });
}

if (targetFormats.iife) {
  buildFormats.push({
    input: "./src/index.ts",
    external,
    output: {
      compact: true,
      file: "dist/oceanfront-vue-router-browser.min.js",
      format: "iife",
      name: "oceanfront",
      exports: "named",
      globals,
    },
    plugins: pluginConfig(true),
  });
}

if (targetFormats.cjs) {
  buildFormats.push({
    input: "./src/index.ts",
    external,
    output: {
      compact: true,
      format: "cjs",
      file: "dist/oceanfront-vue-router.cjs.js",
      exports: "named",
      globals,
    },
    plugins: pluginConfig(),
  });
}

export default buildFormats;
