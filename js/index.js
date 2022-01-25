import "../internalPackages/native-extensions/extensions.js";
import "../node_modules/jquery/dist/jquery.js";

new class {
	projects = [
		"CannonballBox",
		"CanvasDots",
		"InfectionTable",
	];

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

		$(".topNavMenu-dropdown").append(this.projects.map(p => $("<li>", {
			html: $("<a>", {
				text: p,
				href: `/projects/${ p }/`,
			}),
		})));
	}
}();