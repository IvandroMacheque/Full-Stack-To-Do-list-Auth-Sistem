// src/hooks/useCadastro.js
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/API";
import { toast } from "sonner";

export function useCadastro() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Reset de estados
    setNameError("");
    setEmailError("");
    setPasswordError("");

    const nome = nameRef.current.value;
    const email = emailRef.current.value;
    const senha = passwordRef.current.value;

    // Validação Nome
    if (nome.length < 1) {
      setNameError("Este campo é obrigatório");
      return;
    } else if (nome.length < 3) {
      setNameError("O nome deve ter pelo menos 3 caracteres");
      return;
    }

    // Validação Email
    if (email.length < 1) {
      setEmailError("Este campo é obrigatório");
      return;
    } else if (!email.includes("@")) {
      setEmailError("Email inválido");
      return;
    }

    // Validação Senha
    if (senha.length < 1) {
      setPasswordError("Este campo é obrigatório");
      return;
    } else if (senha.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setLoading(true);

    try {
      await api.post("/cadastro", { nome, email, senha });
      navigate("/login");
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
    } catch (err) {
      if (err.response?.status === 409) {
        setEmailError("Email já cadastrado");
        toast.error("Email já cadastrado. Tente outro ou faça login.");
      } else {
        setEmailError("Erro no servidor. Tente novamente");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    nameRef, emailRef, passwordRef,
    nameError, emailError, passwordError,
    loading, setNameError, setEmailError, setPasswordError,
    handleSubmit
  };
}