import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory, getAllBlogCategory, getBlogCategoryById, updateBlogCategoryById } from '../../../services/blogCategory';
import { IBlogCategory } from '../../../types/blogCategory';

const { TextArea } = Input;

interface DataType {
    id: string;
    name: string;
    content: string;
}

const BlogCategories: React.FC = () => {

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [cateUpdate, setCateUpdate] = useState<IBlogCategory>();
    const [formValue, setFromValue] = useState<any>();

    const doCreate = () => {
        // createCategory();

        form
            .validateFields()
            .then((values: any) => {
                const bCate: IBlogCategory = {
                    name: values.name,
                    content: values.content,
                }
                createCategory(bCate)
                    .then(() => {
                        message.success("Thêm danh mục thành công!");
                    }).catch(() => {
                        message.error("Có lỗi!");
                    }).finally(() => {
                        setIsCreateOpen(false);
                    });
            })
            .catch((errorInfo) => {
                message.error("Có lỗi kìa!!!");
                console.log('Form validation failed:', errorInfo);
            });
    }

    const cancelCreate = () => {
        setIsCreateOpen(false);
    }

    const buttonUpdate = async (id: string) => {
        console.log(id);
        await getBlogCategoryById(id)
            .then((data: IBlogCategory) => {
                console.log(data);
                setCateUpdate(data);
                setFromValue(
                    {
                        name: data.name,
                        content: data.content
                    }
                )
                setIsUpdateOpen(true);
            })
    }

    const doUpdate = () => {
        form2
            .validateFields()
            .then((values: any) => {
                if (cateUpdate) {
                    const newCate: IBlogCategory = cateUpdate;
                    newCate.name = values.name;
                    newCate.content = values.content;

                    updateBlogCategoryById(newCate)
                        .then((data: string) => {
                            message.success("Cập nhật thành công!");
                        }).catch(() => {
                            message.error("Cập nhật thất bại!");
                        }).finally(() => {
                            setIsUpdateOpen(false);
                            form2.resetFields();
                        });
                }
            })
            .catch((errorInfo) => {
                message.error("Có lỗi kìa!!!");
                console.log('Form validation failed:', errorInfo);
            });
    }

    const cancelUpdate = () => {
        setIsUpdateOpen(false);
    }

    const buttonDelete = (blogid: string) => {
        setIsDeleteOpen(true);
    }

    const doDelete = () => {

    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    useEffect(() => {
        getAllBlogCategory().then((data: any) => {
            setDataSource(data);
        });
    }, [navigate, isCreateOpen, isUpdateOpen]);

    useEffect(() => {
        if (cateUpdate)
            form2.setFieldsValue(formValue);
    }, [form2, formValue, cateUpdate]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả danh mục',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => buttonUpdate(record.id)}>Sửa</Button>
                        <Button danger onClick={() => buttonDelete(record.id)}>Xóa</Button>
                    </Space>
                )
            }
        }
    ];

    return (
        <div>

            <Button className='mb-4' danger icon={<PlusOutlined />} onClick={() => { setIsCreateOpen(true) }}>
                Thêm danh mục
            </Button>

            <Table rowKey="id" columns={columns} dataSource={dataSource} />

            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Xóa danh mục!"
                open={isDeleteOpen}
                onOk={doDelete}
                onCancel={cancelDelete}
                okText="Xóa"
            >
                <div className='flex flex-col items-center'>
                    Các bài viết trong danh mục sẽ được chuyển sang danh mục mặc định.
                </div>
            </Modal>

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Thêm mới danh mục bài viết!"
                open={isCreateOpen}
                onOk={doCreate}
                onCancel={cancelCreate}
                okText="Tạo mới"
            >
                <div className='flex flex-col items-center'>

                    <Form
                        preserve={false}
                        form={form}
                        name="blogCategoryForm"
                        layout="vertical"
                        labelCol={{ span: 8 }}
                        style={{ minWidth: 400 }}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên!' }]}
                        >
                            <Input size="large" placeholder='Thủ thuật máy tính...' />
                        </Form.Item>

                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[{ required: true, message: 'Hãy nhập nội dung!' }]}
                        >
                            <TextArea
                                size='large'
                                placeholder='Chia sẻ kinh nghiệm về laptops...'
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>

                    </Form>

                </div>
            </Modal>

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Sửa danh mục bài viết!"
                open={isUpdateOpen}
                onOk={doUpdate}
                onCancel={cancelUpdate}
                okText="Cập nhật"
            >
                <div className='flex flex-col items-center'>

                    <Form
                        preserve={false}
                        form={form2}
                        name="blogCategoryForm"
                        layout="vertical"
                        labelCol={{ span: 8 }}
                        style={{ minWidth: 400 }}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên!' }]}
                        >
                            <Input size="large" placeholder='Thủ thuật máy tính...' />
                        </Form.Item>

                        <Form.Item
                            label="Nội dung"
                            name="content"
                            rules={[{ required: true, message: 'Hãy nhập nội dung!' }]}
                        >
                            <TextArea
                                size='large'
                                placeholder='Chia sẻ kinh nghiệm về laptops...'
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>

                    </Form>

                </div>
            </Modal>

        </div>
    )
}

export default BlogCategories;