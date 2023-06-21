import { Button, Form, Input, InputNumber, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { ICoupon } from '../../../types/coupon';
import { updateCo, getCouponById } from '../../../services/coupon';

const EditCoupon: React.FC = () => {
    const navigate = useNavigate();
    const param: any = useParams();

    const [coupon, setCoupon] = useState<ICoupon>();

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username && coupon) {
            const newCo: ICoupon = coupon;
            newCo.name = values.name;
            newCo.code = values.code;
            newCo.discount = values.discount;


            await updateCo(newCo)
                .then(() => {
                    message.success("Thành công!");
                    navigate(routes.ADMIN_COUPON);
                })
                .catch(() => {
                    message.error("Thất bại!");
                });
        } else {
            message.success("Hết hạn, đăng nhập lại!");
            navigate(routes.ADMIN_LOGIN);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (param)
            getCouponById(param.id)
                .then((data: ICoupon) => {
                    setCoupon(data);
                }).catch(() => {
                    navigate("/404");
                }).finally(() => {

                })
    }, [navigate, param])

    return (
        <div>
            {
                coupon &&

                <Form
                    name="newCouponForm"
                    layout="vertical"
                    labelCol={{ span: 8 }}
                    initialValues={coupon}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên mã giảm giá"
                        name="name"
                        rules={[{ required: true, message: 'Hãy nhập mã giảm giá!' }]}
                    >
                        <Input size="large" placeholder='Tiêu đề mã giảm giá!' />
                    </Form.Item>

                    <Form.Item
                        label="CODE"
                        name="code"
                        rules={[{ required: true, message: 'Hãy nhập code giảm giá!' }]}
                    >

                        <Input size='large' placeholder="Hãy nhập mã giảm giá" />
                    </Form.Item>


                    <Form.Item
                        label="Giảm giá"
                        name="discount"
                        rules={[{ required: true, message: 'Hãy nhập loại giảm giá!' }]}
                    >
                        <InputNumber size="large" placeholder='' />
                    </Form.Item>


                    <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] my-3' htmlType="submit">
                        Cập nhật
                    </Button>
                </Form>
            }
        </div>
    )
}

export default EditCoupon;
