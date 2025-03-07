import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importando o useNavigate
import { ToastContainer, toast } from "react-toastify";
import "./Login.css";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!username || !password) {
      toast.error("Preencha todos os campos!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        style: {
          minWidth: "350px",
          minHeight: "120px",
          paddingTop: "100px",
          padding: "20px",
          backgroundColor: "#880707",
        },
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
  
    console.log("Enviando para a API:", {
      username,
      password,
    });
  
    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log("Resposta da API:", result);
  
      if (!response.ok) {
        throw new Error(result.message || "Usuário ou senha inválidos");
      }
  
      toast.success("Login realizado com sucesso!", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        style: {
          minWidth: "350px",
          minHeight: "120px",
          paddingTop: "100px",
          padding: "20px",
          backgroundColor: "#016322",
        },
      });
  
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
  
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        style: {
          minWidth: "350px",
          minHeight: "120px",
          paddingTop: "100px",
          padding: "20px",
          backgroundColor: "#880707"
        },
      });
    }
  };
  

  return (    
    <div>
      <img src="/logoClothes.png" alt="logo loja" id="logo" />
      <form onSubmit={handleSubmit} className="container">  
        <h1>Login</h1>

        <div className="input-field">
          <input 
            type="text" 
            placeholder="Usuário" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="input-field">
          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit">Login</button>

        <div className="signup-link">
          <Link to="/new_user">
            <button type="button">Novo Usuário</button>
          </Link>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Login;
