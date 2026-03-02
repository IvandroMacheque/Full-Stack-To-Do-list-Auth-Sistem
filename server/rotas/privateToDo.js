import express from "express"
import * as privateController from "../controllers/privateController.js"

const router = express.Router()

router.get("/tarefas", privateController.listarTarefas)
router.post("/tarefas", privateController.adicionarTarefa)
router.put("/tarefas/:id", privateController.atualizarTarefa)
router.delete("/tarefas/:id", privateController.deletarTarefa)
router.get("/user-info", privateController.userInfo)
router.delete("/delete-account", privateController.deleteAccount)
router.get("/filtrar-tarefa/:status", privateController.filtrarTarefas)
router.post("/categorias", privateController.adicionarCategoria)
router.get("/categorias", privateController.listarCategorias)
router.get("/tarefas-categoria/:categoryId", privateController.filtrarPorCategoria)  
router.delete("/categorias/:categoryId", privateController.deleteCategoria)



export default router
