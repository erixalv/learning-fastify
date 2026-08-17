import Fastify from "fastify"

const app = Fastify({ logger: true })

// Dados em memória
const livros = [
  { id: 1, titulo: "O Hobbit",          autor: "Tolkien",  preco: 49.90, disponivel: true  },
  { id: 2, titulo: "1984",              autor: "Orwell",   preco: 39.90, disponivel: false },
  { id: 3, titulo: "Clean Code",        autor: "Martin",   preco: 89.90, disponivel: true  },
  { id: 4, titulo: "O Senhor dos Anéis",autor: "Tolkien",  preco: 79.90, disponivel: true  },
]

/*
Rota 1 — GET /livros
Retorna todos os livros. Mas aceita um query param opcional autor — se fornecido, filtra só os livros daquele autor.
*/

interface Querystring {
    autor?: string
}

app.get<{ Querystring: Querystring }>("/livros", async (request) => {
    const {autor} = request.query

    if (autor) {
        return livros.filter(a => a.autor === autor)
    }

    return livros
})

/*
Rota 2 — GET /livros/:id
Busca um livro pelo id. Se não existir, retorna status 404 com { erro: "livro não encontrado" }.
*/

interface Params {
    id?: string
}

app.get<{ Params: Params }>("/livros/:id", async(request, reply) => {
    const id = Number(request.params.id)

    const livro = livros.find(l => l.id === id)

    if (!livro) {
        return reply.status(404).send({ erro: "livro não encontrado" })
    }

    return livro
})

/*
Rota 3 — POST /livros
Cria um novo livro. O body deve ter titulo, autor e preco. O campo disponivel começa como true por padrão. O id é gerado automaticamente (dica: livros.length + 1).
*/

interface Body {
    titulo: string
    autor: string
    preco: number
}

interface Livro {
    id: number
    titulo: string
    autor: string
    preco: number
    disponivel: boolean
}

app.post<{ Body: Body }>("/livros", async (request, reply) => {
    const {titulo, autor, preco} = request.body
    const id = livros.length + 1

    let livro: Livro = {id : id, titulo : titulo, autor : autor, preco : preco, disponivel : true}

    livros.push(livro)

    return reply.status(201).send({criado: true})
})

/*
Rota 4 — PATCH /livros/:id/disponibilidade
Atualiza só o campo disponivel de um livro. O body tem apenas { disponivel: boolean }.
Se o livro não existir, retorna 404. Se existir, atualiza e retorna o livro atualizado com status 200.
*/

interface BodyPatch {
    disponivel: boolean
}

app.patch<{Body: BodyPatch, Params: Params}> ("/livros/:id/disponibilidade", async(request, reply) => {
    const id = Number(request.params.id)
    const {disponivel} = request.body

    const livro = livros.find(l => l.id === id)

    if (livro) {
        livro.disponivel = disponivel
        return reply.status(201).send(livro)
    }

    return reply.status(404).send({erro: "livro não encontrado"})
})

app.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log("servidor rodando em http://localhost:3000")
})