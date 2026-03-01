import express from "express"
import publicRoutes from "./rotas/public.js"
import privateToDoRoutes from "./rotas/privateToDo.js"
import auth from "./middlewares/auth.js"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
))
app.use(express.json())
app.use(cookieParser())
app.use('/', publicRoutes)
app.use('/', auth, privateToDoRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
