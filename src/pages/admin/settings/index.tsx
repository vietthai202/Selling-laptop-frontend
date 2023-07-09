import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes";

const AdminSetting: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex space-x-2">
            <Button danger onClick={() => { navigate(routes.ADMIN_SETTING_MENU) }}>MENU</Button>
            <Button danger onClick={() => { navigate(routes.ADMIN_SETTING_FOOTER) }}>FOOTER</Button>
            <Button danger onClick={() => { navigate(routes.ADMIN_SLIDES) }}>SLIDE</Button>
        </div>
    )
}

export default AdminSetting;