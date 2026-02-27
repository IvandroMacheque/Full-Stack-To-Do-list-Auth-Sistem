import * as authController from "../controllers/authController.js"
import express from "express"

const router = express.Router()

router.post("/cadastro", authController.cadastro)
router.post("/login", authController.login)
router.post("/refresh", authController.refresh)
router.post("/logout", authController.logout)

export default router