import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../routes';
import { isLoggedIn, login } from "../../services/auth";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        await login(values.username, values.password)
            .then((data: any) => {
                message.success("Đăng nhập thành công!");

                if (data.userRole === "ROLE_USER") {
                    navigate("/");
                } else {
                    navigate("/admin");
                }

            })
            .catch(() => {
                message.error("Đăng nhập thất bại!");
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
            <div className='text-3xl mb-3'>ĐĂNG NHẬP TÀI KHOẢN</div>
            <Form
                name="loginForm"
                layout="vertical"
                labelCol={{ span: 8 }}
                style={{ minWidth: 400 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
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

                <Form.Item className='flex justify-center'>
                    <span onClick={() => navigate(routes.FORGOT)} className='font-bold text-red-500 hover:text-red-400 cursor-pointer'>
                        LẤY MẬT KHẨU
                    </span>

                    <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] mx-5' htmlType="submit">
                        ĐĂNG NHẬP
                    </Button>

                    <span onClick={() => navigate(routes.REGISTER)} className='font-bold text-red-500 hover:text-red-400 cursor-pointer'>
                        ĐĂNG KÝ
                    </span>
                </Form.Item>

            </Form>
        </div>
    )
};

export default Login;