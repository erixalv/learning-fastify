import{ FastifyInstance } from "fastify"
import { livros } from "../data/livros.js"

interface Querystring {
    autor?: string
}

interface Params {
    id: string
}

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

interface BodyPatch {
    disponivel: boolean
}

export async function livrosRoutes(app: FastifyInstance) {
    app.get<{ Querystring: Querystring }>("/", async (request) => {
        const {autor} = request.query

        if (autor) {
            return livros.filter(a => a.autor === autor)
        }

        return livros
    })

    app.get<{ Params: Params }>("/:id", async(request, reply) => {
        const id = Number(request.params.id)

        const livro = livros.find(l => l.id === id)

        if (!livro) {
            return reply.status(404).send({ erro: "livro não encontrado" })
        }

        return livro
    })

    app.post<{ Body: Body }>("/", async (request, reply) => {
        const {titulo, autor, preco} = request.body
        const id = livros.length + 1

        let livro: Livro = {id : id, titulo : titulo, autor : autor, preco : preco, disponivel : true}

        livros.push(livro)

        return reply.status(201).send({criado: true})
    })

    app.patch<{Body: BodyPatch, Params: Params}> ("/:id/disponibilidade", async(request, reply) => {
        const id = Number(request.params.id)
        const {disponivel} = request.body

        const livro = livros.find(l => l.id === id)

        if (livro) {
            livro.disponivel = disponivel
            return reply.status(200).send(livro)
        }

        return reply.status(404).send({erro: "livro não encontrado"})
    })
}