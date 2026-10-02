import { readFile,writeFile } from "node:fs/promises"

const ARQUIVO = new URL("./data.json", import.meta.url)

export async function lerEmprestimos() {
  try {
    const conteudo = await readFile(ARQUIVO, "utf-8")
    return JSON.parse(conteudo) } catch (err) {
    if (err.code === "ENOENT") return []
    throw err
}
}
  export async function salvarEmprestimos(lista) {
  
    await writeFile(ARQUIVO, JSON.stringify(lista, null, 2), "utf-8")
}