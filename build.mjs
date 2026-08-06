import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import CleanCSS from "clean-css";
import { minify as minifyJs } from "terser";

const root = dirname(fileURLToPath(import.meta.url));
const cssFiles = ["style", "infostyle", "projectstyle"];
const jsFiles = ["script"];

const log = (msg) => console.log(`[build] ${msg}`);

for (const name of cssFiles) {
  const src = await readFile(join(root, "css", `${name}.css`), "utf8");
  const result = new CleanCSS({ level: 2 }).minify(src);
  if (result.errors.length) {
    console.error(`[build] CSS errors in ${name}:`, result.errors);
    process.exit(1);
  }
  await writeFile(join(root, "css", `${name}.min.css`), result.styles);
  log(`css/${name}.css -> css/${name}.min.css (${(result.styles.length / 1024).toFixed(1)} KB)`);
}

for (const name of jsFiles) {
  const src = await readFile(join(root, `${name}.js`), "utf8");
  const result = await minifyJs(src, { compress: true, mangle: true });
  if (result.error) {
    console.error(`[build] JS error in ${name}:`, result.error);
    process.exit(1);
  }
  await writeFile(join(root, `${name}.min.js`), result.code);
  log(`${name}.js -> ${name}.min.js (${(result.code.length / 1024).toFixed(1)} KB)`);
}

log("done");
