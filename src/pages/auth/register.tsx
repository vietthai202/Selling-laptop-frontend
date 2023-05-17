import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';
import { isLoggedIn, register } from '../../services/auth';
import type { IRegister } from '../../types/auth';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const onFinish = async (values: any) => {
        const userInfo: IRegister = {
            name: values.name,
            email: values.email,
            username: values.username,
            password: values.password
        }
        await register(userInfo)
            .then((data: any) => {
                message.success(data.message);
                navigate("/login")
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
            <div className='text-3xl mb-3'>ĐĂNG KÝ TÀI KHOẢN</div>
            <Form
                name="loginForm"
                layout="vertical"
                labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                style={{ minWidth: 400 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tên bạn"
                    name="name"
                    rules={[{ required: true, message: 'Hãy nhập tên của bạn!' }]}
                >
                    <Input size="large" placeholder='Nguyễn Văn A' />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ email"
                    name="email"
                    rules={[{ required: true, message: 'Hãy nhập email!', type: "email" }]}
                >
                    <Input size="large" placeholder='example@gmail.com' />
                </Form.Item>

                <Form.Item
                    label="Tài khoản"
                    name="username"
                    rules={[{ required: true, message: 'Hãy nhập tài khoản!' }]}
                >
                    <Input size="large" placeholder='Tên tài khoản của bạn' />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
                >
                    <Input.Password size="large" placeholder='Mật khẩu của bạn' />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" className='bg-red-500 hover:bg-[#6d6d6d]' htmlType="submit">
                        Đăng ký
                    </Button>
                    <span onClick={() => navigate(routes.LOGIN)} className='ml-5 font-bold text-red-500 hover:text-red-400 cursor-pointer'>
                        ĐĂNG NHẬP
                    </span>
                </Form.Item>
            </Form>
        </div>
    )
};

export default Register;