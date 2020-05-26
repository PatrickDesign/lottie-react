import babel from "rollup-plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import { terser } from "rollup-plugin-terser";

import packageJSON from "./package.json";

/**
 * We are using 'build/compiled/index.js' instead of 'src/index.ts'
 * because we need to compile the code first.
 *
 * We could've used the '@rollup/plugin-typescript' but that plugin
 * doesn't allow us to rename the files on output. So we decided to
 * compile the code and after that to run the rollup command using
 * the index file generated by the compilation.
 *
 * @type {string}
 */
const input = "./compiled/index.js";

/**
 * Get the extension for the minified files
 * @param pathToFile
 * @return string
 */
const minifyExtension = (pathToFile) => pathToFile.replace(/\.js$/, ".min.js");

/**
 * Definition of the common plugins used in the rollup configurations
 */
const reusablePluginList = [
	postcss({
		plugins: [autoprefixer],
	}),
	babel({
		exclude: "node_modules/**",
	}),
	external(),
	resolve(),
	commonjs(),
];

/**
 * Definition of the rollup configurations
 */
const exports = {
	cjs: {
		input,
		output: {
			file: packageJSON.main,
			format: "cjs",
			sourcemap: true,
		},
		external: ["lottie-web"],
		plugins: reusablePluginList,
	},
	cjs_min: {
		input,
		output: {
			file: minifyExtension(packageJSON.main),
			format: "cjs",
		},
		external: ["lottie-web"],
		plugins: [...reusablePluginList, terser()],
	},
	umd: {
		input,
		output: {
			file: packageJSON.browser,
			format: "umd",
			sourcemap: true,
			name: "lottie-react",
			globals: {
				react: "React",
				"prop-types": "PropTypes",
				"lottie-web": "Lottie",
			},
		},
		external: ["lottie-web"],
		plugins: reusablePluginList,
	},
	umd_min: {
		input,
		output: {
			file: minifyExtension(packageJSON.browser),
			format: "umd",
			name: "lottie-react",
			globals: {
				react: "React",
				"prop-types": "PropTypes",
				"lottie-web": "Lottie",
			},
		},
		external: ["lottie-web"],
		plugins: [...reusablePluginList, terser()],
	},
	es: {
		input,
		output: {
			file: packageJSON.module,
			format: "es",
			sourcemap: true,
			exports: "named",
		},
		external: ["lottie-web"],
		plugins: reusablePluginList,
	},
	es_min: {
		input,
		output: {
			file: minifyExtension(packageJSON.module),
			format: "es",
			exports: "named",
		},
		external: ["lottie-web"],
		plugins: [...reusablePluginList, terser()],
	},
};

export default [
	exports.cjs,
	exports.cjs_min,
	exports.umd,
	exports.umd_min,
	exports.es,
	exports.es_min,
];
