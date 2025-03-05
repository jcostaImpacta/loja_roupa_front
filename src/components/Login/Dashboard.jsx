import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      color: "#fff",
      textAlign: "center",
    }}>
      <h1>🛠️ Página em construção 🚧</h1>
      <p style={{marginTop: "20px"}}>Estamos trabalhando para trazer novidades em breve!</p>
      <button 
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#001469",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Retornar ao Login
      </button>
    </div>
  );
};

export default Dashboard;
