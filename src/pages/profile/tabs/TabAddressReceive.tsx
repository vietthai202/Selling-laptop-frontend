import { Card } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TabAddressReceive: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);

    useEffect(() => {
        if (username) {

        }
    }, [username]);

    return (
        <>
            <div className="container mx-auto">
                <Card title="Sổ địa chỉ nhận hàng">haha</Card>
            </div>
        </>
    )
}

export default TabAddressReceive;