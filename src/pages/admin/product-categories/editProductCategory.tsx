import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { convertToSlug } from '../../../utils/string';
import { IProductCategory } from '../../../types/productCategory';
import { editProductCategory, getProductCategoryById } from '../../../services/productCategory';

const { TextArea } = Input;

const EditProductCategory: React.FC = () => {
    const navigate = useNavigate();
    const param: any = useParams();

    const [category, setCategory] = useState<IProductCategory>();

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username && category) {
            const newCate: IProductCategory = category;
            newCate.name = values.name;
            newCate.description = values.description;
            newCate.slug = convertToSlug(values.name);

            await editProductCategory(newCate)
                .then(() => {
                    message.success("Thành công!");
                    navigate(routes.ADMIN_PRODUCTCATEGORIES);
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
            getProductCategoryById(param.id)
                .then((data: IProductCategory) => {
                    setCategory(data);
                }).catch(() => {
                    navigate("/404");
                }).finally(() => {

                })
    }, [navigate, param])

    return (
        <div>
            {
                category &&

                <Form
                    name="newBlogForm"
                    layout="vertical"
                    labelCol={{ span: 8 }}
                    initialValues={category}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="name"
                        rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                    >
                        <Input size="large" placeholder='Tiêu đề cho bài viết!' />
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
                        Cập nhật
                    </Button>
                </Form>
            }
        </div>
    )
}

export default EditProductCategory;
