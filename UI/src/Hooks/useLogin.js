// src/hooks/useLogin.js
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/API"
import { toast } from "sonner"

export function useLogin() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        // Reseta erros
        setEmailError("")
        setPasswordError("")

        const email = emailRef.current.value
        const senha = passwordRef.current.value

        // Validações
        if (email.length < 1) {
            setEmailError("Este campo é obrigatório")
            return
        } else if (!email.includes("@")) {
            setEmailError("Email inválido")
            return
        }

        if (senha.length < 1) {
            setPasswordError("Este campo é obrigatório")
            return
        } else if (senha.length < 6) {
            setPasswordError("A senha deve ter pelo menos 6 caracteres")
            return
        }

        setLoading(true)

        try {
            // Chamada da API
            const response = await api.post("/login", { email, senha })
            const token = response.data.token || response.data;
            
            localStorage.setItem("token", token)
            navigate("/tarefas")
            toast.success("Bem vindo de volta, " + email.split("@")[0] + "!")
        } catch (err) {
            if (err.response?.status === 404) {
                setEmailError("Usuário não encontrado")
                toast.error("Usuário não encontrado. Verifique seu email ou cadastre-se.")
            } else if (err.response?.status === 401) {
                setPasswordError("Senha incorreta")
                toast.error("Senha incorreta. Tente novamente.")
            } else {
                setEmailError("Erro no servidor. Tente novamente")
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        emailRef,
        passwordRef,
        emailError,
        passwordError,
        loading,
        setEmailError,
        setPasswordError,
        handleSubmit
    }
}