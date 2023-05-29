import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { convertToSlug } from '../../../utils/string';
import { IProductCategory } from '../../../types/productCategory';
import { addProductCategory } from '../../../services/productCategory';

const { TextArea } = Input;

const AddProductCategory: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username) {
            const category: IProductCategory = {
                id: 0,
                name: values.name,
                description: values.description,
                image: 'https://i.imgur.com/Keus9bC.jpeg',
                slug: convertToSlug(values.name),
            }

            console.log(category);

            await addProductCategory(category)
                .then(() => {
                    message.success("Thành công!");
                    navigate(routes.ADMIN_PRODUCTCATEGORIES);
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
                name="newCategoryForm"
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
                    <Input size="large" placeholder='Tiêu đề danh mục!' />
                </Form.Item>

                <Form.Item
                    label="Mô tả ngắn"
                    name="description"
                    rules={[{ required: true, message: 'Hãy nhập mô tả ngắn!' }]}
                >
                    <TextArea
                        size='large'
                        placeholder="Mô tả về danh mục"
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

export default AddProductCategory;
