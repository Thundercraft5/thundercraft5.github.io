console.time("import");
console.log(await import("./out/linkedom/index.js"));
console.timeEnd("import");