import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './NewUser.css';

const NewUser = () => {
    const [codigo, setCodigo] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (senha !== confirmarSenha) {
            toast.error("As senhas não conferem!");
            loading = false;
            return;
        }

        const formData = new FormData();
        formData.append("username", codigo);
        formData.append("password", senha);
        formData.append("confirmPassword", confirmarSenha);
        formData.append("email", email);
        formData.append("userDescription", description);

        try {
            setLoading(true);
            const response = await fetch("/api/create_user/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: codigo,
                    password: senha,
                    confirmPassword: confirmarSenha,
                    email: email,
                    userDescription: description
                }),
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Erro ao cadastrar usuário");
            }

            toast.success("Cadastro realizado com sucesso!", {
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

            toast.error(`${error.message || "Erro ao cadastrar o usuário."}`, {
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
        <div className="popup">
            <img src="/logoClothes.png" alt="logo loja" id="logo" />
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Novo Usuário</h1>
                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="Usuário" 
                        maxLength="20" 
                        value={codigo} 
                        onChange={(e) => setCodigo(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="Nome" 
                        maxLength="20" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        maxLength="20" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        maxLength="20" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Confirmar Senha" 
                        maxLength="20" 
                        value={confirmarSenha} 
                        onChange={(e) => setConfirmarSenha(e.target.value)} 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={!codigo || !senha || !confirmarSenha}
                >Criar novo usuário
                </button>
            </form>
         <ToastContainer />
        </div>
    );
};

export default NewUser;
