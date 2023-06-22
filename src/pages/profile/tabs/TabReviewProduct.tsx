import { Card } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TabReviewProduct: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);

    useEffect(() => {
        if (username) {

        }
    }, [username]);

    return (
        <>
            <div className="container mx-auto">
                <Card title="Sản phẩm bạn đã đánh giá">haha</Card>
            </div>
        </>
    )
}

export default TabReviewProduct;