import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
})

// interceptador de requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

// INTERCEPTOR DE RESPOSTA
api.interceptors.response.use(
    (response) => response, // Se a resposta for 200 (OK), apenas segue o fluxo
    async (error) => {
        const originalRequest = error.config

        // Se o erro for 401 e ainda não tentamos renovar o token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // Marca para não entrar em loop de erro

            try {
                const res = await axios.post('http://localhost:3001/refresh', {}, { withCredentials: true })
                const novoToken = res.data.token
                console.log(novoToken)
                localStorage.setItem('token', novoToken)

                // 2. Atualiza o token na requisição que tinha falhado
                originalRequest.headers.Authorization = `Bearer ${novoToken}`

                // 3. Tenta realizar a requisição original novamente!
                return api(originalRequest)

            } catch (refreshError) {
                // Se até o Refresh Token (Cookie) expirou, o usuário tem que logar de novo
                console.error("Sessão expirada. Faça login novamente.")
                localStorage.removeItem('token')
                window.location.href = '/login' // Redireciona para o login
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api

