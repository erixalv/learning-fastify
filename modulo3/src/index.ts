import Fastify from "fastify"
import {livrosRoutes} from "./routes/livros.js"

const app = Fastify({logger: false})

app.register(livrosRoutes, {prefix: "/livros"})

app.listen({port: 3000}, (err) => {
    if (err) {console.error(err); process.exit(1)}

    console.log("rodando em http://localhost:3000")
})