import { Button, Form, Input, InputNumber, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { ICoupon } from '../../../types/coupon';
import { createCO } from '../../../services/coupon';
const AddCoupon: React.FC = () => {
    const navigate = useNavigate();
    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username) {
            const coupon: ICoupon = {
                id: 0,
                name: values.name,
                code: values.code,
                discount: values.Discount,
            }

            console.log(coupon);

            await createCO(coupon)
                .then(() => {
                    message.success("Thành công!");
                    navigate(routes.ADMIN_COUPON);
                })
                .catch(() => {
                    message.error("Thất bại!");
                });
        } else {
            message.success("Hết hạn, đăng nhập lại!");
            navigate(routes.LOGIN);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                name="newCouponForm"
                layout="vertical"
                labelCol={{ span: 8 }}
                initialValues={{ remember: true }}
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
                    name="Discount"
                    rules={[{ required: true, message: 'Hãy nhập loại giảm giá!' }]}
                >
                    <InputNumber size="large" placeholder=' ' />
                </Form.Item>

                <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] my-3' htmlType="submit">
                    Thêm mới
                </Button>
            </Form>
        </div>
    )
}

export default AddCoupon;
