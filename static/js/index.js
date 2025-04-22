import "/packages/native-extensions/extensions.js";
import "jquery";

new class {
	projects = [
		"CannonballBox",
		"CanvasDots",
		"InfectionTable",
		"EslintEditor",
		"MinMaxFinder",
	];

	packages = {
		"@thundercraft5/weak-utils": ["TS", "https://github.com/Thundercraft5/weak-utils"],
		"@thundercraft5/tsconfig": ["TS", "https://github.com/Thundercraft5/tsconfig"],
		"@thundercraft5/node-errors": ["TS", "https://github.com/Thundercraft5/node-errors"],
		"@thundercraft5/mixin.js": ["TS", "https://github.com/Thundercraft5/mixin.js"],
		"@thundercraft5/eslint-plugin": ["TS", "https://github.com/Thundercraft5/eslint-plugin"],
		"@thundercraft5/node-cron": ["TS", "https://github.com/Thundercraft5/node-cron"],
		"YoutubeFullscreen": ["Chrome", "https://github.com/Thundercraft5/YoutubeFullscreen"],
		"obsidian-pgn-viewer": ["Obsidian", "https://github.com/Thundercraft5/obsidian-pgn-viewer"],
		"Class.lua": ["Lua", "https://github.com/Thundercraft5/Class.lua"],
	};

	icons = {
		TS: "Typescript_logo_2020.svg",
		Chrome: "Google_Chrome_icon_(February_2022).svg",
		Obsidian: "2023_Obsidian_logo.svg",
		Lua: "Lua-Logo.svg",
	};

	tests = [];

	licenseNotice = // html
		$(`
		<div id="copyright-notice">
			<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
				<img alt="Creative Commons License" style="border-width:0" src="https://licensebuttons.net/l/by-sa/4.0/88x31.png" />
			</a>.
			All content on this page unless otherwise noted is released under the <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA 4.0</a> license, meaning as long as you attribute this site with a proper link and re-distribute it under the same license, you are free to use this content in any way. The license for the code in this site is located <a href="https://github.com/Thundercraft5/thundercraft5.github.io/blob/main/LICENSE">here</a>.
		</div>
	`);

	constructor() {
		$("main").append(this.licenseNotice);
		$("footer").append([$("<ul>", {
			class: "plainlist",
			html: [
				$("<li>", {
					class: "flex-center",
					html: [$('<img src="/resources/icons/Octicons-mark-github.svg" height="16px" width="16px"/>'), "&nbsp;", $("<a>", { href: "https://github.com/Thundercraft5", text: "Github", class: "bold lightLink" })],
				}),
				$("<li>", {
					class: "flex-center",
					html: [$('<img src="/resources/icons/Stack_Overflow_icon.svg" height="16px" width="16px"/>'), "&nbsp;", $("<a>", { href: "https://stackoverflow.com/users/16423247/thundercraft5", text: "Stack Overflow", class: "bold lightLink" })],
				}),
				$("<li>", {
					class: "flex-center",
					html: [$('<img src="/resources/icons/npm-icon-svgrepo-com.svg" height="16px" width="16px"/>'), "&nbsp;", $("<a>", { href: "https://www.npmjs.com/~thundercraft5", text: "NPM", class: "bold lightLink" })],
				}),
				$("<li>", {
					class: "flex-center",
					html: [$('<img src="/resources/icons/discord-icon-svgrepo-com.svg" height="16px" width="16px"/>'), "&nbsp;", $("<a>", { href: "https://www.npmjs.com/~thundercraft5", text: "Discord", class: "bold lightLink" })],
				}),
				$("<li>", {
					class: "flex-center",
					html: [$('<img src="/resources/icons/Wikipedia\'s_W.svg" height="16px" width="16px"/>'), "&nbsp;", $("<a>", { href: "https://wikipedia.org/wiki/User:Thundercraft5", text: "Wikipedia", class: "bold lightLink" })],
				}),
				$("<li>", {
					class: "flex-center",
					html: [$('<img src="/resources/icons/Fandom_heart-logo.svg" height="16px" width="16px"/>'), "&nbsp;", $("<a>", { href: "https://community.fandom.com/wiki/User:Thundercraft5", text: "FANDOM (retired, 2019-2022)", class: "bold lightLink" })],
				}),
			],

		})]);

		$("#projectsDropdown").append(this.projects.map(p => $("<li>", {
			html: $("<a>", {
				text: p,
				href: `/projects/${ p }/`,
			}),
		})));

		$("#packagesDropdown").append(Object.entries(this.packages).map(([p, [type, url]]) => $("<li>", {
			html: $("<a>", {
				html: [
					$("<img>", {
						src: `/resources/icons/${ this.icons[type] }`,
						height: "16px",
						width: "16px",
					}),
					$("<code>", { text: p }),
				],
				href: url,
			}),
		})));

		twemoji.parse(document.body);
	}
}();