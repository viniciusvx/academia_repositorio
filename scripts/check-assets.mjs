// Falha o build se algum arquivo de imagem for um ponteiro do Git LFS (texto) em vez da imagem real.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const exts = /\.(webp|png|jpe?g|gif|ico)$/i;
const bad = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (exts.test(name) && readFileSync(path).subarray(0, 40).toString("utf8").startsWith("version https://git-lfs")) bad.push(path);
  }
}

["src", "public"].forEach(walk);

if (bad.length) {
  console.error("Estes arquivos são ponteiros do Git LFS, não imagens reais:\n" + bad.map((p) => " - " + p).join("\n"));
  process.exit(1);
}
console.log("Imagens OK: nenhum ponteiro do Git LFS encontrado.");
