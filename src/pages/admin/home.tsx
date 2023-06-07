import { useEffect } from "react";
import { isLoggedIn } from "../../services/auth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {

        if (!isLoggedIn()) {
            navigate("/admin/login");
        }

    }, [navigate]);

    return (
        <div>OKOK ADMIN</div>
    )
}

export default Admin;