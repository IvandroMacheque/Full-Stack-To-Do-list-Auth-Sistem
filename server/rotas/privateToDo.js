import express from "express"
import * as privateController from "../controllers/privateController.js"

const router = express.Router()

router.get("/tarefas", privateController.listarTarefas)
router.post("/tarefas", privateController.adicionarTarefa)
router.put("/tarefas/:id", privateController.atualizarTarefa)
router.delete("/tarefas/:id", privateController.deletarTarefa)
router.get("/user-info", privateController.userInfo)
router.delete("/delete-account", privateController.deleteAccount)



export default router
