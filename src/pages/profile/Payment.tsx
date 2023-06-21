import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderById, getOrderByUserName } from "../../services/order";
import { Button, Card, QRCode } from "antd";
import TPBank from "../../assets/images/TPBank.webp"
import { generateQRCode } from "../../services/vietqr";
import { IQRCode } from "../../types/qrcode";
import { useParams } from "react-router-dom";
import { IOrder } from "../../types/order";
import formatCurrency from "../../utils/formatCurrency";

const Payment: React.FC = () => {
    const param: any = useParams();
    const username = useSelector((state: any) => state.user.username);
    const [qrCode, setQrCode] = useState<string>("");
    const [order, setOrder] = useState<IOrder>();

    useEffect(() => {
        if (username && param) {
            getOrderByUserName(username)
                .then((data) => {
                    const checkExistId = data.some((item: any) => Number(item.id) === Number(param.orderid));
                    if (checkExistId) {
                        getOrderById(param.orderid).then((data: IOrder) => {
                            console.log(data)
                            setOrder(data);
                            const qrData: IQRCode = {
                                accountNo: 8234567890000,
                                accountName: "NGUYEN QUANG TRUONG",
                                acqId: 970423,
                                amount: data.totalPrice,
                                addInfo: `SWPORDER${param.orderid}`,
                                format: "text"
                            }

                            generateQRCode(qrData).then((data: any) => {
                                setQrCode(data.data.qrCode)
                            })
                        })
                    }
                })
        }
    }, [param, username]);

    return (
        <>{
            qrCode ?
                <Card className="container mx-auto py-4 md:w-[600px]">
                    <div className="flex space-x-4">
                        <div className="flex flex-col items-center">
                            <QRCode
                                errorLevel="H"
                                value={qrCode}
                                icon={TPBank}
                            />
                        </div>
                        <div className="flex flex-col space-y-3">
                            <div className="flex flex-col">
                                <div className="font-bold text-2xl">
                                    Order #{param.orderid}
                                </div>
                                <div>
                                    Desc order
                                </div>
                            </div>
                            <div className="text-red-500 font-bold">
                                {order && formatCurrency(order.totalPrice)}
                            </div>
                            <div>
                                Nội dung chuyển khoản: <span className="text-red-500 font-bold">{`SWPORDER${param.orderid}`}</span>
                            </div>
                            <div>
                                <Button>PENDING</Button>
                                <div className="mt-2">
                                    Order tự động chuyển sang trạng thái DONE khi chúng tôi đã nhận được tiền!
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                :
                <>Sai order id</>
        }
        </>
    )
}

export default Payment;