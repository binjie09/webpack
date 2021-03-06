/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const RuntimeModule = require("../RuntimeModule");

/** @typedef {import("../Compilation")} Compilation */

class PublicPathRuntimeModule extends RuntimeModule {
	constructor() {
		super("publicPath");
	}

	/**
	 * @returns {string} runtime code
	 */
	generate() {
		const publicPath = this.compilation.outputOptions.publicPath;
		if (!publicPath) {
			return `${RuntimeGlobals.publicPath} = (() => {
				if (typeof window !== "undefined" && "currentScript" in window.document) {
					return window.document.currentScript.src.replace(/[^\\/]+$/, "");
				} else {
					return ${JSON.stringify(
						this.compilation.getPath(publicPath || "", {
							hash: this.compilation.hash || "XXXX"
						})
					)};
					// throw new Error("Webpack: Auto public path is not supported in modules or when 'document.currentScript' is unavailable. Use a polyfill or set 'publicPath' config explicitly.");
				}
			})();`;
		} else {
			return `${RuntimeGlobals.publicPath} = ${JSON.stringify(
				this.compilation.getPath(publicPath || "", {
					hash: this.compilation.hash || "XXXX"
				})
			)};`;
		}
	}
}

module.exports = PublicPathRuntimeModule;
