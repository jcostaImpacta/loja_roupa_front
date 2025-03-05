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
    const [loading, setLoading] = useState(false);  // Controle de loading
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (senha !== confirmarSenha) {
            toast.error("As senhas não conferem!");
            return;
        }

        const formData = new FormData();
        formData.append("username", codigo);
        formData.append("password", senha);
        formData.append("confirmPassword", confirmarSenha);
        formData.append("email", email);
        formData.append("userDescription", description);

        try {
            setLoading(true);  // Ativar loading
            const response = await fetch("/create_usuario/", { // Alterado de /novo_usuario para /create_usuario/
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
            
            const result = await response.text();

            if (!response.ok) {
                throw new Error(result.message || "Erro ao criar novo usuário");
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
            // ⏳ Aguarda 2 segundos e redireciona para o Dashboard
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
                <h1>New User</h1>
                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="User Name" 
                        maxLength="20" 
                        value={codigo} 
                        onChange={(e) => setCodigo(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="text" 
                        placeholder="Name" 
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
                        placeholder="Password" 
                        maxLength="20" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        maxLength="20" 
                        value={confirmarSenha} 
                        onChange={(e) => setConfirmarSenha(e.target.value)} 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={!codigo || !senha || !confirmarSenha || senha !== confirmarSenha || loading}
                >Create New Account
                </button>
            </form>
         <ToastContainer />
        </div>
    );
};

export default NewUser;
