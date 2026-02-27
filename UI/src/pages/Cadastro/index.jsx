/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion'
import { useCadastro } from "../../hooks/useCadastro"

function Cadastro() {
  const {
    nameRef, emailRef, passwordRef,
    nameError, emailError, passwordError,
    loading, setNameError, setEmailError, setPasswordError,
    handleSubmit
  } = useCadastro()

  return (
    <div className="mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-lg shadow-lg max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastro</h2>
      
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        
        <div>
          <input 
            ref={nameRef} 
            type="text" 
            placeholder="Nome" 
            onChange={() => setNameError("")} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none transition-colors ${
              nameError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
            }`} 
          />
          <AnimatePresence>
            {nameError && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-red-500 text-xs mt-1 ml-1 overflow-hidden">
                {nameError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <input 
            ref={emailRef} 
            type="email" 
            placeholder="Email" 
            onChange={() => setEmailError("")} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none transition-colors ${
              emailError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
            }`} 
          />
          <AnimatePresence>
            {emailError && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-red-500 text-xs mt-1 ml-1 overflow-hidden">
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <input 
            ref={passwordRef} 
            type="password" 
            placeholder="Senha" 
            onChange={() => setPasswordError("")} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none transition-colors ${
              passwordError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
            }`} 
          />
          <AnimatePresence>
            {passwordError && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-red-500 text-xs mt-1 ml-1 overflow-hidden">
                {passwordError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`cursor-pointer w-full text-white py-2 px-4 rounded-md transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Processando..." : "Cadastrar"}
        </button>
      </form>

      <Link to="/login" className="block text-center mt-4 text-blue-700 hover:text-blue-800 hover:underline">
        Já tem uma conta? Faça login
      </Link>
    </div>
  )
}

export default Cadastro