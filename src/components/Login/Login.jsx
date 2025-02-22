import React from "react";
import { useState } from "react";
import "./Login.css";

<link rel="stylesheet" href="./Login.css" />
const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSumit = () => {
        event.preventDefault();

        alert("Enviando os dados: " + username + " - " + password);

        console.log("teste", username, password);
        console.log("Envio");
    }

  return (    
    <div className="container">
      <form onSubmit={handleSumit}>    
        <h1>Acesse o Login</h1>
        <div className="input-field">
          <input type="email" placeholder="E-mail" onChange={(e) => setUsername(e.target.value)} />
          <faUser className="icon" />
        </div>
        <div className="input-field">
          <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="recall-forget">
            <label htmlFor="">
                <input type="checkbox" />
                Lembra de mim
            </label>
            <br />
            <a href="#">Esqueceu a senha?</a>
        </div>
        
        <button>Entrar</button>

        <div className="signup-link">
            <p>
                Não tem uma conta? <a href="#">Registrar</a>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
