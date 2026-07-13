import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const role = sessionStorage.getItem("role");

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "Admin") {
        return <Navigate to="/mainpage" replace />;
    }

    return children;
};

export default AdminRoute;