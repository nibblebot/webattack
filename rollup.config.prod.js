import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"

export default {
	external: ["phaser"],
	global: {
		phaser: "Phaser"
	},
	input: "src/index.js",
	output: {
		file: "dist/bundle.js",
		format: "cjs",
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs(),
		babel({
			exclude: "node_modules/**" // only transpile our source code
		})
	]
}
