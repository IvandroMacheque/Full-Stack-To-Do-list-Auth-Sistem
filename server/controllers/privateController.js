import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

const secretKey = process.env.JWT_SECRET

// Listar tarefas

export const listarTarefas = async (req, res) => {
    const { search, category, status } = req.query
    try{
        const tarefas = await prisma.todo.findMany(
            {
                where: { 
                    userId: req.userId,
                    titulo: {
                        contains: search || "",
                        mode: 'insensitive'
                    },
                    categoryId: category || undefined,
                    concluida: status === "concluidas" ? true : status === "pendentes" ? false : undefined
                },
                orderBy: [
                    { concluida: 'asc' }, // Pendentes (false) vêm antes de Concluídas (true)
                    { titulo: 'asc' }    // Ordem alfabética de A-Z
                ],
                include: {
                    category: true
                }
            }
        )
        res.status(200).json({message: "Tarefas listadas com sucesso", tarefas})
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// adicionar categoria

export const adicionarCategoria = async (req, res) => {
    const categoria = req.body

    if(!categoria.nome || categoria.nome.trim() === ""){
        return res.status(400).json({ message: "Nome da categoria é obrigatório" })
    }
    try{
        const novaCategoria = await prisma.category.create({
            data: {
                nome: categoria.nome,
                userId: req.userId,
                cor: categoria.cor || "#ff0000"
            }
        })
        res.status(200).json({message: "Categoria adicionada com sucesso", novaCategoria})
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
}

// buscar categorias para filtro
export const listarCategorias = async (req, res) => {
    try {
        const categorias = await prisma.category.findMany({
            where: { userId: req.userId },
            orderBy: { nome: 'asc' },

        });
        res.status(200).json({ message: "Categorias listadas com sucesso", categorias })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
     }
    }

// deletar categoria

export const deleteCategoria = async (req, res) => {
    const categoryId = req.params.categoryId
    try {
        await prisma.category.delete({
            where: {
                id: categoryId,
                userId: req.userId
            }
        });
        res.status(200).json({ message: "Categoria deletada com sucesso" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro no servidor. Tente Novamente" })
    }
};

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
                dataInicio: task.dataInicio ? new Date(task.dataInicio) : null,
                dataTermino: task.dataTermino ? new Date(task.dataTermino) : null,
                categoryId: task.categoryId || null, 
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


export const editarTarefa = async (req, res) => {
    const { id } = req.params
    const { titulo } = req.body

    if (!titulo || titulo.trim() === "") {
        return res.status(400).json({ message: "O título não pode estar vazio" })
    }

    try {
        const tarefaAtualizada = await prisma.todo.update({
            where: { 
                id: id, // Ou parseInt(id) se seu ID for número
                userId: req.userId // Garante que o usuário só edita a própria tarefa
            },
            data: { titulo }
        })

        res.status(200).json(tarefaAtualizada);
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar tarefa" })
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
        })
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Conta excluída com sucesso" })
    } catch (err) {
        res.status(500).json({ message: "Erro ao excluir conta" })
    }
}