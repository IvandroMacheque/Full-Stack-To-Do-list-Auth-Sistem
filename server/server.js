import express from "express"
import publicRoutes from "./rotas/public.js"
import privateToDoRoutes from "./rotas/privateToDo.js"
import auth from "./middlewares/auth.js"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))
app.use(express.json())
app.use(cookieParser())
app.use('/', publicRoutes)
app.use('/', auth, privateToDoRoutes)

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001")
})
