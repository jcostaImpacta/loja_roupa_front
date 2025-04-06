import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccessToast, showErrorToast } from "./toastConfig";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      showErrorToast("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Erro ao fazer login");
      }

      showSuccessToast("Login realizado com sucesso!");
      localStorage.setItem("username", result.username);
      setTimeout(() => navigate("/products"), 2000);
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>Login</button>
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
