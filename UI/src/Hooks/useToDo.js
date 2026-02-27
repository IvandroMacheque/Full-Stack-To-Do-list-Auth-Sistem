/* eslint-disable no-unused-vars */
// src/hooks/useToDo.js
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/API"

export function useToDo() {
    const [allTasks, setAllTasks] = useState([])
    const [taskError, setTaskError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const tituloRef = useRef()
    const navigate = useNavigate()
    const [user, setUser] = useState({ nome: "", email: "" })
    const [menuOpen, setMenuOpen] = useState(false)

    // Carregar tarefas
    async function loadTasks() {
        try {
            const { data: { tarefas } } = await api.get("/tarefas")
            setAllTasks(tarefas)
        } catch (err) {
            console.error("Erro ao carregar tarefas:", err)
        }
    }

    // Adicionar tarefa
    async function SubmitTask() {
        if (tituloRef.current.value.trim() === "") {
            setTaskError("A tarefa é obrigatória")
            return
        }
        
        setIsSubmitting(true)

        try {
            await api.post("/tarefas", {
                titulo: tituloRef.current.value,
                concluida: false
            });
            tituloRef.current.value = ""
            setTaskError("")
            loadTasks()
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao adicionar tarefa")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Atualizar tarefa
    async function updateTask(id, concluida) {
        try {
            await api.put(`/tarefas/${id}`, { concluida })
            loadTasks()
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao atualizar")
        }
    }

    // Deletar tarefa
    async function deleteTask(id) {
        try {
            await api.delete(`/tarefas/${id}`)
            loadTasks()
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao deletar")
        }
    }

    // Logout
    async function handleLogout() {
        try {
            await api.post('/logout')
        } catch (err) {
            console.error("Erro no logout")
        } finally {
            localStorage.removeItem('token')
            navigate('/login')
        }
    }

    async function handleDeleteAccount() {
        const confirmacao = confirm("TEM CERTEZA? Isso apagará todas as suas tarefas e não pode ser desfeito.")
        
        if (confirmacao) {
            try {
                await api.delete("/delete-account")
                localStorage.removeItem("token")
                window.location.href = "/login" // Volta para o login
            } catch (err) {
                alert("Erro ao excluir conta.")
            }
        }
    }

    async function getUserData() {
            const res = await api.get("/user-info")
            setUser(res.data)
        }

    useEffect(() => {
        loadTasks()
        getUserData()
    }, [])

    return {
        allTasks,
        tituloRef,
        taskError,
        isSubmitting,
        setTaskError,
        SubmitTask,
        updateTask,
        deleteTask,
        handleLogout,
        menuOpen,
        handleDeleteAccount,
        user,
        setMenuOpen
        
    }
}