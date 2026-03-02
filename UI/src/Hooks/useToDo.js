/* eslint-disable no-unused-vars */
// src/hooks/useToDo.js
import { useState, useEffect, useRef } from "react"
import { data, useNavigate } from "react-router-dom"
import api from "../services/API"
import { toast } from "sonner"

export function useToDo() {
    const [allTasks, setAllTasks] = useState([])
    const [taskError, setTaskError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)
    const tituloRef = useRef()
    const navigate = useNavigate()
    const [user, setUser] = useState({ nome: "", email: "" })
    const [menuOpen, setMenuOpen] = useState(false)
    const dataInicioRef = useRef()
    const dataTerminoRef = useRef()
    const [filtroAtivo, setFiltroAtivo] = useState("todos")
    const [filtroCategoriaAtivo, setFiltroCategoriaAtivo] = useState(null)
    const categoriaRef = useRef()
    const corRef = useRef()
    const [allCategorias, setAllCategorias] = useState([])
    const [categoriaEscolhida, setCategoriaEscolhida] = useState("")

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
                concluida: false,
                dataInicio: dataInicioRef.current.value || null,
                dataTermino: dataTerminoRef.current.value || null,
                categoryId: categoriaEscolhida || null
            });
            tituloRef.current.value = ""
            dataInicioRef.current.value = ""
            dataTerminoRef.current.value = ""
            setCategoriaEscolhida("")
            setTaskError("")
            loadTasks()
            toast.success("Tarefa adicionada com sucesso!")
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
            if (concluida) {
                toast.success("Tarefa marcada como concluída!")
            } else {
                toast.info("Tarefa marcada como pendente.")
            }
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao atualizar")
        }
    }

    // Deletar tarefa
    async function deleteTask(id) {
        try {
            await api.delete(`/tarefas/${id}`)
            loadTasks()
            toast.warning("Tarefa deletada com sucesso!")
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao deletar")
        }
    }

    // status da tarefa
    function getStatus(tarefa) {
        if (tarefa.concluida) return { label: "Concluída", color: "bg-green-100 text-green-700" };
        
        const hoje = new Date();
        const dataTermino = tarefa.dataTermino ? new Date(tarefa.dataTermino) : null;
        const dataInicio = tarefa.dataInicio ? new Date(tarefa.dataInicio) : null;

        if (dataTermino && hoje > dataTermino) {
            return { label: "Atrasada", color: "bg-red-100 text-red-700" };
        }
        
        if (dataInicio && hoje < dataInicio) {
            return { label: "Planejada", color: "bg-blue-100 text-blue-700" };
        }

        return { label: "Em andamento", color: "bg-yellow-100 text-yellow-700" };
    }

    // Filtro de tarefas
    async function filtrarTarefas(status) {
        try {
            const { data: { tarefas } } = await api.get(`/filtrar-tarefa/${status}`)
            setFiltroAtivo(status)
            setAllTasks(tarefas)
        } catch (err) {
            console.error("Erro ao filtrar tarefas:", err)
        }
    }

    // adicionar categoria
    async function adicionarCategoria() {
        if (categoriaRef.current.value.trim() === "") {
            setCategoryError("A categoria é obrigatória")
            return
        }
        setIsSubmittingCategory(true)
        try {            
            await api.post("/categorias", {
                nome: categoriaRef.current.value,
                cor: corRef.current.value
            })
            categoriaRef.current.value = ""
            corRef.current.value = "#ff0000"
            carregarCategorias()
            toast.success("Categoria adicionada com sucesso!")
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao adicionar categoria")
        } finally {
            setIsSubmittingCategory(false)
        }
    }

    // carregar categorias para filtro
    async function carregarCategorias() {
        try {
            const { data: { categorias } } = await api.get("/categorias")
            setAllCategorias(categorias)
        } catch (err) {
            console.error("Erro ao carregar categorias:", err)
            return []
        }
    }

    // Filtrar por categoria
    async function filtrarPorCategoria(categoryId) {
        try {
            const { data: { tarefas } } = await api.get(`/tarefas-categoria/${categoryId}`)
            if (filtroCategoriaAtivo === categoryId) {
                setFiltroCategoriaAtivo(null)
                loadTasks()
                return
            }
            setFiltroCategoriaAtivo(categoryId)
            setAllTasks(tarefas)
        } catch (err) {
            console.error("Erro ao filtrar por categoria:", err)
        }
    }

    // deletar categoria
    async function deleteCategoria(categoryId) {
        const confirmacao = confirm("TEM CERTEZA? Isso deletará todas as tarefas associadas a esta categoria e não pode ser desfeito.")

        if (confirmacao) {
            try {
                await api.delete(`/categorias/${categoryId}`)
                carregarCategorias()
                loadTasks()
                toast.warning("Categoria deletada com sucesso!")
            } catch (err) {
                alert(err.response?.data?.message || "Erro ao deletar categoria")
            }
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

    // Deletar conta
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

    // Carregar dados do usuário
    async function getUserData() {
            const res = await api.get("/user-info")
            setUser(res.data)
        }

    useEffect(() => {
        loadTasks()
        getUserData()
        carregarCategorias()
    }, [])

    return {
        allTasks,
        allCategorias,
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
        setMenuOpen,
        dataInicioRef,
        dataTerminoRef,
        getStatus,
        filtrarTarefas,
        filtroAtivo,
        categoriaRef,
        corRef,
        adicionarCategoria,
        categoryError,
        isSubmittingCategory,
        setCategoryError,
        categoriaEscolhida,
        setCategoriaEscolhida,
        filtrarPorCategoria,
        filtroCategoriaAtivo,
        deleteCategoria
    }
}