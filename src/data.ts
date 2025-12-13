export { default as routesManifest } from "../public/routes-manifest.json"

export const packages = {
	"@thundercraft5/weak-utils": ["TS", "https://github.com/Thundercraft5/weak-utils"],
	"@thundercraft5/tsconfig": ["TS", "https://github.com/Thundercraft5/tsconfig"],
	"@thundercraft5/node-errors": ["TS", "https://github.com/Thundercraft5/node-errors"],
	"@thundercraft5/node-deferred": ["TS", "https://github.com/Thundercraft5/node-deferred"],
	"@thundercraft5/mixin.js": ["TS", "https://github.com/Thundercraft5/mixin.js"],
	"@thundercraft5/eslint-plugin": ["TS", "https://github.com/Thundercraft5/eslint-plugin"],
	"@thundercraft5/node-cron": ["TS", "https://github.com/Thundercraft5/node-cron"],
	"YoutubeFullscreen": ["Chrome", "https://github.com/Thundercraft5/YoutubeFullscreen"],
	"obsidian-pgn-viewer": ["Obsidian", "https://github.com/Thundercraft5/obsidian-pgn-viewer"],
	"Class.lua": ["Lua", "https://github.com/Thundercraft5/Class.lua"],
} as const,
	links = {
		"discord": "",
		"github": "https://github.com/Thundercraft5",
		"npm": "https://www.npmjs.com/~thundercraft5",
		"stackoverflow": "https://stackoverflow.com/users/16423247/thundercraft5",
		"wikipedia": "https://en.wikipedia.org/wiki/User:Thundercraft5",
		"fandom": "https://community.fandom.com/wiki/User:Thundercraft5",
		"lichess": "https://lichess.org/@/nkgplays",
		"obsidian": "https://forum.obsidian.md/u/thundercraft5",
	} as const,
	projects = {
		"Local": ["/projects", [
			"CannonballBox",
			"CanvasDots",
			"InfectionTable",
			"ESlintEditor",
			"MinMaxFinder",
		]],
		"GitHub": ["https://github.com/Thundercraft5", ["obsidian-keepassxc", "thundercraft5.github.io", "Celestia", "cli-manager", "obsidian-pgn-viewer"]]

		
	} as const;

