import prisma from "../lib/prisma.js"
import {FastifyInstance} from "fastify"

interface Params { 
    id: string
}

interface Livro {
    titulo: string
    autor: string
    preco: number
    disponivel: boolean
}

interface BodyPatch {
    disponivel: boolean
}

export async function livrosRoutes(app: FastifyInstance) {

    app.get("/", async () => {
        return prisma.livro.findMany()
    })

    app.get<{Params: Params}>("/:id", async (request, reply) => {
        const id = Number(request.params.id)
        
        const livro = await prisma.livro.findUnique({where: {id}})
        if(livro) {
            return livro
        }

        return reply.status(404).send({erro: "Livro não encontrado"})
    })

    app.post<{Body: Livro}>("/", async (request, reply) => {
        const livro = await prisma.livro.create({data: request.body})

        return reply.status(201).send(livro)
    })

    app.patch<{Params: Params, Body: BodyPatch}>("/:id/disponibilidade", async (request, reply) => {
        const id = Number(request.params.id)

        try{
            const livro = await prisma.livro.update({where: {id}, data: request.body})
            return livro
        } catch {
            return reply.status(404).send({erro: "Livro não encontrado"})
        }
    })
}