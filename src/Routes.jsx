import { Routes, Route } from "react-router-dom";
import App from "./App";
import NewUser from "./components/Login/NewUser";
import Dashboard from "./components/Login/Dashboard";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/new_user" element={<NewUser />} />
            <Route path="/dashboard" element={<Dashboard />} /> {}
        </Routes>
    );
}

export default AppRouter;
