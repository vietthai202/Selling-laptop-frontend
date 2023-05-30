import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '../../../routes';
import { isLoggedIn, logout } from '../../../services/auth';
import { editBrand, getBrandById } from '../../../services/brands';
import { IBrand } from '../../../types/brand';
import { convertToSlug } from '../../../utils/string';
import UploadSingleImage from '../../../components/SingleUploadImage';

const { TextArea } = Input;

const EditSlide: React.FC = () => {
    const navigate = useNavigate();
    const param: any = useParams();

    const [image, setImage] = useState<string | null>(null);

    const [brand, setBrand] = useState<IBrand>();

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username && brand) {
            const newBrand: IBrand = brand;
            newBrand.name = values.name;
            newBrand.description = values.description;
            newBrand.image = image;
            newBrand.slug = convertToSlug(values.name);

            await editBrand(newBrand)
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

    useEffect(() => {
        if (param) {
            getBrandById(param.id)
                .then((data: IBrand) => {
                    setBrand(data);
                    setImage(data.image);
                    console.log(data);
                }).catch(() => {
                    message.error("Có lỗi khi lấy dữ liệu!");
                    logout();
                    navigate("/admin/login");
                })
        }
    }, [navigate, param])

    return (
        <div>
            {
                brand &&

                <Form
                    name="newBlogForm"
                    layout="vertical"
                    labelCol={{ span: 8 }}
                    style={{ minWidth: 400 }}
                    initialValues={brand}
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

                    <UploadSingleImage valueProps={image} setValueProps={setImage} />

                    <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] my-3' htmlType="submit">
                        Cập nhật
                    </Button>
                </Form>
            }
        </div>
    )
}

export default EditSlide;
