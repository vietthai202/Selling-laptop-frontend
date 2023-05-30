import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';
import { forgotPass, isLoggedIn } from '../../services/auth';

const LossPass: React.FC = () => {
    const navigate = useNavigate();
    const onFinish = async (values: any) => {

        await forgotPass(values.email)
            .then(async (data: any) => {
                message.success("Lấy mật thành công! Kiểm tra email của bạn!");
            }).catch(() => {
                message.error("Hệ thống có lỗi!");
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/");
        }
    }, [navigate]);
    return (
        <div className='flex flex-col items-center justify-center py-20'>
            <div className='text-3xl mb-3'>LẤY LẠI MẬT KHẨU</div>
            <Form
                name="registerForm"
                layout="vertical"
                labelCol={{ span: 8 }}
                style={{ minWidth: 400 }}
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <Form.Item
                    label="Địa chỉ email"
                    name="email"
                    rules={[{ required: true, message: 'Hãy nhập email!', type: "email" }]}
                >
                    <Input size="large" placeholder='example@gmail.com' />
                </Form.Item>

                <Form.Item className='flex justify-center'>
                    <span onClick={() => navigate(routes.REGISTER)} className='font-bold text-red-500 hover:text-red-400 cursor-pointer'>
                        ĐĂNG KÝ
                    </span>
                    <Button type="primary" className='bg-red-500 hover:bg-[#6d6d6d] mx-5' htmlType="submit">
                        LẤY MẬT KHẨU
                    </Button>
                    <span onClick={() => navigate(routes.LOGIN)} className='font-bold text-red-500 hover:text-red-400 cursor-pointer'>
                        ĐĂNG NHẬP
                    </span>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LossPass;