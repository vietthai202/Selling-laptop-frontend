import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Divider, Form, Input, Select, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditer from '../../../components/TextEditer';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { createBlog } from '../../../services/blog';
import { createCategory, getAllBlogCategory } from '../../../services/blogCategory';
import { IBlog } from '../../../types/blog';
import { IBlogCategory } from '../../../types/blogCategory';
import { convertToSlug } from '../../../utils/string';

const { TextArea } = Input;

const AddBlog: React.FC = () => {
    const navigate = useNavigate();

    const [textEditValue, setTextEditValue] = useState('');

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username) {
            const blogData: IBlog = {
                name: values.blogName,
                content: textEditValue,
                image: 'https://i.imgur.com/Keus9bC.jpeg',
                slug: convertToSlug(values.blogName),
                shortContent: values.blogDesc,
                createdAt: '',
                userName: username,
                categoryId: values.blogCategory,
            }

            await createBlog(blogData)
                .then(() => {
                    message.success("Đăng bài thành công!");
                    navigate(routes.ADMIN_BLOGS);
                })
                .catch(() => {
                    message.error("Đăng bài thất bại!");
                });
        } else {
            message.success("Hết hạn, đăng nhập lại!");
            navigate(routes.LOGIN);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const [items, setItems] = useState<IBlogCategory[]>();
    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');
    const inputRef = useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(event.target.value);
    };

    const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        const newCate: IBlogCategory = {
            name: categoryName,
            content: categoryDesc,
        }

        if (newCate) {
            await createCategory(newCate)
                .then((data: IBlogCategory) => {
                    const cateReturn: IBlogCategory = data;
                    items && setItems([...items, cateReturn]);
                    setCategoryName('');
                    setCategoryDesc('');
                    message.success("Tạo danh mục thành công!");
                }).catch(() => {
                    message.error("Lỗi khi tạo danh mục!");
                }).finally(() => {
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 0);
                })
        } else {
            message.error("Lỗi khi tạo danh mục!");
        }

    };

    useEffect(() => {
        getAllBlogCategory().then((data: IBlogCategory[]) => {
            setItems(data);
        })
    }, []);

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
                    name="blogName"
                    rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                >
                    <Input size="large" placeholder='Tiêu đề cho bài viết!' />
                </Form.Item>

                <Form.Item
                    label="Danh mục"
                    name="blogCategory"
                    rules={[{ required: true, message: 'Chọn danh mục!' }]}
                >
                    <Select
                        placeholder="Chọn danh mục hoặc tạo mới!"
                        size='large'
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    <div className='flex flex-col'>
                                        <Input
                                            placeholder="Nhập tên danh mục mới!"
                                            ref={inputRef}
                                            value={categoryName}
                                            onChange={onNameChange}
                                        />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <TextArea
                                            placeholder="Mô tả về danh mục"
                                            value={categoryDesc}
                                            onChange={(e) => setCategoryDesc(e.target.value)}
                                            autoSize={{ minRows: 3, maxRows: 5 }}
                                        />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Button danger icon={<PlusOutlined />} onClick={addItem}>
                                            Thêm danh mục
                                        </Button>
                                    </div>


                                </Space>
                            </>
                        )}
                        options={items && items.map((item: IBlogCategory) => ({ label: item.name, value: item.id }))}
                    />

                </Form.Item>

                <Form.Item
                    label="Mô tả ngắn"
                    name="blogDesc"
                    rules={[{ required: true, message: 'Hãy nhập mô tả ngắn!' }]}
                >
                    <TextArea
                        size='large'
                        placeholder="Mô tả về danh mục"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <TextEditer valueProps={textEditValue} setValueProps={setTextEditValue} />

                <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] my-3' htmlType="submit">
                    Đăng bài
                </Button>
            </Form>
        </div>
    )
}

export default AddBlog;
