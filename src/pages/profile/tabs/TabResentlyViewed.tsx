import { Card } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TabResentlyViewed: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);

    useEffect(() => {
        if (username) {

        }
    }, [username]);

    return (
        <>
            <div className="container mx-auto">
                <Card title="Sản phẩm bạn vừa mới xem">haha</Card>
            </div>
        </>
    )
}

export default TabResentlyViewed;