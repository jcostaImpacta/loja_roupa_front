import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccessToast, showErrorToast } from "./toastConfig";
import './NewUser.css';

const NewUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [userDescription, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            showErrorToast("As senhas não conferem!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/create_user/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username,
                    password,
                    confirmPassword,
                    email,
                    userDescription
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Erro ao cadastrar usuário");
            }

            showSuccessToast("Cadastro realizado com sucesso!");
            
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            showErrorToast(error.message || "Erro ao cadastrar o usuário.");
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = !username || !password || !confirmPassword || loading;

    return (
        <div className="popup">
            <img src="/logoClothes.png" alt="logo loja" id="logo" />
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Novo Usuário</h1>
                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="Usuário" 
                        maxLength="20" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="Nome" 
                        maxLength="30" 
                        value={userDescription} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        maxLength="50" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        maxLength="20" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Confirmar Senha" 
                        maxLength="20" 
                        value={confirmPassword} 
                        onChange={(e) => setconfirmPassword(e.target.value)} 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isButtonDisabled}
                >Criar novo usuário
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default NewUser;
