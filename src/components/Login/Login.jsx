import React from "react";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // Estado para armazenar o usuário
  const [password, setPassword] = useState(""); // Estado para armazenar a senha
  const [error, setError] = useState(null); // Estado para mensagens de erro

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Resetando erro antes de enviar

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch("/login/", {
        method: "POST",
        body: formData, // Enviando como form-data
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }

      const result = await response.json();
      console.log("Login bem-sucedido:", result);
      alert("Login realizado com sucesso!");
      // Aqui você pode redirecionar o usuário ou salvar o token no localStorage

    } catch (error) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (    
    <div>
      <img src="/logoClothes.png" alt="logo loja" id="logo" />
      <form onSubmit={handleSubmit} className="container">  
        <img src="/perfil.png" alt="icone usuario" id="icone"/>  
        <h1>User Login</h1>
        
        <div className="input-field">
          <input 
            type="text" 
            placeholder="Username" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="input-field">
          <input 
            type="password" 
            placeholder="Password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        {error && <p className="error">{error}</p>} {/* Exibe erro se houver */}

        <button type="submit">Login</button>

        <div className="signup-link">
          <button>New User</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
