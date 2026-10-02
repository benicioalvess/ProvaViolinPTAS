import express from "express";
import { lerEmprestimos } from "./data.js";

const app = express();
app.use(express.json());

function campoFaltando(body) {
  if (!textoValido(body.nomeAluno)) return "nomeAluno"
  if (!textoValido(body.livro)) return "livro"
  return null

}
//////R2 bglh do cadastro
app.get("/emprestimos", async (req, res) => {
  try {
    const todos = await lerEmprestimos()

    const ativos = todos.filter((e) => e.devolvidoEm === null)
    
    res.status(200).json(ativos) } catch (err) {
    
        res.status(500).json({ erro: "Erro interno ao ler os empréstimos." })}})

        

app.post("/emprestimos", async (req, res) => {
  try {
    const body = req.body ?? {}
    
    const faltando = campoFaltando(body)
    
    if (faltando) {
      return res.status(400).json({ erro: `O campo "${faltando}" é obrigatório.` })
    }

    const todos = await lerEmprestimos()
    
    const novoId = todos.reduce((max, e) => Math.max(max, e.id), 0) + 1

            const novo = {
        id: novoId,
      nomeAluno: body.nomeAluno.trim(),
        livro: body.livro.trim(),devolvidoEm: null,
    }

    todos.push(novo)
    
    await salvarEmprestimos(todos)

    res.status(201).json(novo)} catch (err) {
    res.status(500).json({ erro: "Erro interno ao cadastrar o empréstimo." })
  }
})



///// R3
app.put("/emprestimos/:id", async (req, res) => {
         try {
    const id = Number(req.params.id)
        const body = req.body ?? {}
            const faltando = campoFaltando(body)
    
    
    if (faltando) {
      return res.status(400).json({ erro: `O campo "${faltando}" é obrigatório.` });
    }

        const todos = await lerEmprestimos()

        const indice = todos.findIndex((e) => e.id === id)
    
    if (indice === -1) {
      return res.status(404).json({ erro: `Empréstimo ${req.params.id} não encontrado.`
     })}

        const atualizado = {
         id, nomeAluno: body.nomeAluno.trim(), livro: body.livro.trim(), devolvidoEm: todos[indice].devolvidoEm,
            }
            todos[indice] = atualizado
            await salvarEmprestimos(todos)

    res.status(200).json(atualizado)} catch (err) {
    res.status(500).json({ erro: "Erro interno ao atualizar o empréstimo." })
  }
});

// R3 atualiza os emprestimos
app.patch("/emprestimos/:id", async (req, res) => {

    try {
    const id = Number(req.params.id)
    const body = req.body ?? {}

    const todos = await lerEmprestimos()
    
    const indice = todos.findIndex((e) => e.id === id);
            
            if (indice === -1) {
            return res.status(404).json({ erro: `Empréstimo ${req.params.id} não encontrado.`
            })}


    
    const mudancas = {}
    for (const campo of ["nomeAluno", "livro"]) {
      if (body[campo] !== undefined) {
        if (!textoValido(body[campo])) {
          return res.status(400).json({ erro: `O campo "${campo}" deve ser um texto não vazio.` })
        }
        mudancas[campo] = body[campo].trim()
      }
    }



    const atualizado = { ...todos[indice], ...mudancas }
        todos[indice] = atualizado
            await salvarEmprestimos(todos)
    
            res.status(200).json(atualizado)} catch (err) {
            res.status(500).json({ erro: "erro interno ao atualizar o empréstimo." })  

}})

app.listen(3000, () => {
console.log("API rodando em http://localhost:3000")})