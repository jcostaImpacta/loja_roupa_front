import { Routes, Route } from "react-router-dom";
import App from "./App";
import NewUser from "./components/Login/NewUser";
import Products from "./components/Login/Products";
import Order from "./components/Login/Order";


function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/new_user" element={<NewUser />} />
            <Route path="/products" element={<Products />} />
            <Route path="/new_order" element={<Order/>} />
        </Routes>
    );
}

export default AppRouter;
