import * as monaco from "monaco-editor";
import * as Tree from "monaco-editor/esm/vs/base/browser/ui/tree/indexTreeModel.js";
/*
 * import { AutoTypings, LocalStorageCache } from "monaco-editor-auto-typings";
 * import dedent from "dedent";
 * import { Linter } from "eslint4b";
 */

console.log(Tree);
self.MonacoEnvironment = {
	getWorkerUrl(moduleId, label) {
		if (label === "json")
			return "./js/dist/json.worker.js";

		if (label === "css" || label === "scss" || label === "less")
			return "./js/dist/css.worker.js";

		if (label === "html" || label === "handlebars" || label === "razor")
			return "./js/dist/html.worker.js";

		if (label === "typescript" || label === "javascript")
			return "./js/dist/ts.worker.js";

		return "./js/dist/editor.worker.js";
	},
};
window.process = { env: {}, cwd() {} };
monaco.languages.typescript.javascriptDefaults.addExtraLib(
	"export declare function add(a: number, b: number): number",
	"file:///node_modules/@types/math/index.d.ts",
);

/** @type {import("monaco-editor").editor.IStandaloneEditorConstructionOptions} */
const options = {
	model: monaco.editor.createModel("", "javascript", monaco.Uri.file("main.js")),

	smoothScrolling: true,
	cursorBlinking: "smooth",
	cursorSmoothCaretAnimation: true,
	theme: "vs-dark",
	lightbulb: {
		enabled: true,
	},
};

monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
	declaration: true,
	allowNonTsExtensions: true,
	allowJs: true,
	target: 99,
});

window.options = options;

const editor = monaco.editor.create(document.querySelector(".eslintEditor"), options);

window.editor = editor;
window.monaco = monaco;

window.models = [];

(async() => {
	const { default: { Linter } } = await import("../node_modules/eslint/lib/linter/index.js");
	const [
		js,
		module,
	 ] = await Promise.all([
		fetch("./js/content.js"),
		fetch("./js/module.js"),
	].map(p => p.then(r => r.text())));
	const { uri } = editor.getModel();

	editor.getModel().setValue(js);
	window.models.push(
		editor.getModel(),
		monaco.editor.createModel(module, "javascript", monaco.Uri.file("test.js")),
	);
	const worker = await (await monaco.languages.typescript.getJavaScriptWorker())(uri);

	console.log(await worker.getEmitOutput(uri.toString()));
	window.worker = worker;
	window.uri = uri;
	/*
	 * console.log(new Linter().verifyAndFix(editor.getValue(), {
	 * 	parserOptions: {
	 * 		sourceType: "module",
	 * 		ecmaVersion: "latest",
	 * 	},
	 * }));
	 */
})();

console.log("Test");