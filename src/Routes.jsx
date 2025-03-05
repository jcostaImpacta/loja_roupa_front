import { Routes, Route } from "react-router-dom";
import App from "./App";
import NewUser from "./components/Login/NewUser";
import Dashboard from "./components/Login/Dashboard"; // Importando o Dashboard

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/novo_usuario" element={<NewUser />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Mantendo a rota do Dashboard */}
        </Routes>
    );
}

export default AppRouter;
