import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

const secretKey = process.env.JWT_SECRET

// Listar tarefas

export const listarTarefas = async (req, res) => {
    try{
        const tarefas = await prisma.todo.findMany(
            {
                where: { userId: req.userId },
                orderBy: [
                    { concluida: 'asc' }, // Pendentes (false) vêm antes de Concluídas (true)
                    { titulo: 'asc' }    // Ordem alfabética de A-Z
                ]
            }
        )
        res.status(200).json({message: "Tarefas listadas com sucesso", tarefas})
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// Adicionar tarefa

export const adicionarTarefa = async (req, res) => {
    const task = req.body

    if(!task.titulo || task.titulo.trim() === ""){
        return res.status(400).json({ message: "Titulo da tarefa é obrigatório" })
    }
    try{
        const tarefa = await prisma.todo.create({
            data: {
                titulo: task.titulo,
                concluida: task.concluida,
                userId: req.userId
            }
        })
        res.status(200).json({message: "Tarefa adicionada com sucesso", tarefa})
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// marcar como concluida

export const atualizarTarefa = async (req, res) => {
    const task = req.body
    const id = req.params.id
    try{
        const tarefa = await prisma.todo.update({
            where: {
                id: id,
                userId: req.userId
            },
            data: {
                concluida: task.concluida
            }
        })
        res.status(200).json({message: "Tarefa atualizada com sucesso", tarefa})
    }
    catch(error){
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// Deletar tarefa

export const deletarTarefa = async (req, res) => {
    const id = req.params.id
    try{
        const tarefa = await prisma.todo.delete({
            where: {
                id: id,
                userId: req.userId
            }
        })
        res.status(200).json({message: "Tarefa deletada com sucesso", tarefa})
    }
    catch(error){
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// Buscar informacoes do usuario

export const userInfo = async (req, res) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: req.userId },
            select: { nome: true, email: true } // Não enviamos a senha por segurança!
        });
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar dados do usuário" });
    }
}

// Deletar a conta do usuario

export const deleteAccount = async (req, res) => {
    try {
        await prisma.usuario.delete({
            where: { id: req.userId }
        });
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Conta excluída com sucesso" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao excluir conta" });
    }
}