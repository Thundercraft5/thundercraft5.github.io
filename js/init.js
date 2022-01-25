{
	const r = new XMLHttpRequest();

	r.onload = () => {
		const map = JSON.parse(r.responseText);

		document.head.append(Object.assign(document.createElement("script"), {
			id: "importMap",
			textContent: JSON.stringify(map),
			type: "importmap",
		}));
	};
	r.open("GET", "/imports.importmap", false);
	r.send();
}