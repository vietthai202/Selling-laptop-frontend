import { useEffect, useState } from "react";
import { getOrderByUserName } from "../../../services/order";
import { useSelector } from "react-redux";
import { Button, Card } from "antd";

const TabProfileOrder: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);
    const [orderData, setOrderData] = useState<any>();

    useEffect(() => {
        if (username) {
            getOrderByUserName(username)
                .then((data) => {
                    console.log(data);
                    setOrderData(data);
                })
        }
    }, [username]);

    return (
        <>
            <div className="container mx-auto">
                <Card title="Đơn hàng của tôi">
                    <ul className="divide-y divide-gray-300">
                        {
                            orderData && orderData.map((data: any) => (
                                <li key={data.id} className="py-2 list-none">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg">Order #{data.id} - {data.totalPrice} VNĐ</span>

                                        {!data.transactions &&
                                            <Button danger target="_blank" href={`/profile/payment/${data.id}`}>Thanh toán</Button>
                                        }
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </Card>
            </div>
        </>
    )
}

export default TabProfileOrder;