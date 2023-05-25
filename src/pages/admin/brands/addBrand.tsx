import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { addBrand } from '../../../services/brands';
import { IBrand } from '../../../types/brand';
import { convertToSlug } from '../../../utils/string';

const { TextArea } = Input;

const AddBrand: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username) {
            const brand: IBrand = {
                id: 0,
                name: values.name,
                description: values.description,
                image: 'https://i.imgur.com/Keus9bC.jpeg',
                slug: convertToSlug(values.name),
            }

            await addBrand(brand)
                .then(() => {
                    message.success("Thành công!");
                    navigate(routes.ADMIN_BRANDS);
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
                name="newBlogForm"
                layout="vertical"
                labelCol={{ span: 8 }}
                style={{ minWidth: 400 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tiêu đề"
                    name="name"
                    rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                >
                    <Input size="large" placeholder='Tiêu đề nhãn hàng!' />
                </Form.Item>

                <Form.Item
                    label="Mô tả ngắn"
                    name="description"
                    rules={[{ required: true, message: 'Hãy nhập mô tả ngắn!' }]}
                >
                    <TextArea
                        size='large'
                        placeholder="Mô tả về thương hiệu"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>


                <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] my-3' htmlType="submit">
                    Thêm mới
                </Button>
            </Form>
        </div>
    )
}

export default AddBrand;
