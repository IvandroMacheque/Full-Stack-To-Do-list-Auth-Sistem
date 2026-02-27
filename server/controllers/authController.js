// controllers/authController.js
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const secretKey = process.env.JWT_SECRET


// Cadastro

export const cadastro = async (req, res) => {
    try{
    const user = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.senha, salt)

    const novoUsuario = await prisma.usuario.create({
        data: {
            nome: user.nome,
            email: user.email,
            senha: hashPassword
        }
    })
    res.status(201).json({message: "Usuario cadastrado com sucesso"})
    }
    catch(error){
        if(error.code === "P2002"){ // o p2002 é um codigo de erro do prisma que indica que o email ja foi cadastrado
           return res.status(409).json({ message: "Email ja cadastrado" }) // 409 é o codigo de erro para conflito
        }
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// Login

export const login = async (req, res) => {
    try{
        const userInfo = req.body

        // buscar usuario no banco de dados
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: userInfo.email
            }
        })

        // verifica se o usuario existe
        if(!usuario){
            return res.status(404).json({ message: "Usuario não encontrado" })
        }

        // verifica se a senha esta correta
        const senhaCorreta = await bcrypt.compare(userInfo.senha, usuario.senha)
        if(!senhaCorreta){
            return res.status(401).json({ message: "Senha incorreta" })
        }

        // Gerar Tokens
        const token = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: "7d" })

        // Encriptar e salvar Refresh Token no Banco
        const salt = await bcrypt.genSalt(10)
        const hashRefreshToken = await bcrypt.hash(refreshToken, salt)
                
        await prisma.usuario.update({
            where: { id: usuario.id },
            data: { refreshToken: hashRefreshToken }
        })
        
        // Enviar Cookie e Resposta
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })
        
        res.status(200).json({ message: "Login realizado com sucesso", token })
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" })
    }

}

export const refresh = async (req, res) => {
    try {
        // Pegar o Refresh Token que está escondido no Cookie
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ message: "Não autenticado" })
        }

        // Verifica se o token é válido
        const decoded = jwt.verify(refreshToken, secretKey) 
        
        // Busca o usuário no banco para ver o Hash do token
        const usuario = await prisma.usuario.findUnique({
            where: { id: decoded.id }
        })

        if (!usuario || !usuario.refreshToken) {
            return res.status(403).json({ message: "Acesso negado" })
        }

        // Compara o token do cookie com o HASH que está no banco
        const isMatch = await bcrypt.compare(refreshToken, usuario.refreshToken)

        if (!isMatch) {
            return res.status(403).json({ message: "Token inválido" })
        }

        // Se tudo deu certo, gera um NOVO Access Token de 15 min
        const novoToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "15m" })

        // Retorna apenas o novo token de acesso
        res.json({ token: novoToken })

    } catch (error) {
        console.log(error)
        res.status(403).json({ message: "Sessão expirada. Faça login novamente" })
    }
}

// logout
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (refreshToken) {
            const decoded = jwt.decode(refreshToken)
            
            if (decoded) {
                await prisma.usuario.update({
                    where: { id: decoded.id },
                    data: { refreshToken: null }
                })
            }
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.status(200).json({ message: "Logout realizado com sucesso!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro ao fazer logout" })
    }
}