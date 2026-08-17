import {FastifyInstance} from "fastify"
import {livros} from "../data/livros.js"

const autores = [
  { id: 1, nome: "Tolkien",  nacionalidade: "britânico" },
  { id: 2, nome: "Orwell",   nacionalidade: "britânico" },
  { id: 3, nome: "Martin",   nacionalidade: "americano" },
]

interface Params {
    id: string
}

interface Querystring {
    nacionalidade?: string
}

interface Autor {
    id: number
    nome: string
    nacionalidade:string
}

function buscaAutorPorId(id: number, autores: Autor[]) {
  return autores.find(a => a.id === id)
}

export async function autoresRoutes(app: FastifyInstance) {
    app.get<{Querystring : Querystring}>("/", async (request) => {
        const {nacionalidade} = request.query

        if (nacionalidade) {
            return autores.filter(a => a.nacionalidade === nacionalidade)
        }

        return autores
    })

    app.get<{Params : Params}>("/:id", async (request, reply) => {
        const id = Number(request.params.id)
        const autor =  buscaAutorPorId(id, autores)

        if(autor) {
            return autor
        }

        return reply.status(404).send({erro : "Autor não encontrado"})
    })

    app.get<{Params: Params}>("/:id/livros", async (request, reply) => {
        const id = Number(request.params.id)
        const autor = buscaAutorPorId(id, autores)

        if(autor) {
            const livrosDoAutor = livros.filter(l => l.autor === autor.nome)

            if (livrosDoAutor.length === 0) {
                return reply.status(404).send({ erro: "Autor não tem livros cadastrados." })
            }

            return livrosDoAutor      
        }

        return reply.status(404).send({erro: "Autor não encontrado."})        
    })
}