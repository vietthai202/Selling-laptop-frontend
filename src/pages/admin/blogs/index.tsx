import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/auth';
import { deleteBlog, getAllBlog } from '../../../services/blog';
import routes from '../../../routes';

const Blogs: React.FC = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [blogDelete, setBlogDelete] = useState<string>("");

    const buttonUpdate = (slug: string) => {
        navigate(`/admin/blogs/edit/${slug}`);
    }

    const buttonDelete = (blogid: string) => {
        setIsDeleteOpen(true);
        setBlogDelete(blogid);
    }

    const doDelete = () => {
        if (blogDelete) {
            deleteBlog(blogDelete)
                .then((data: any) => {
                    setIsDeleteOpen(false);
                    setBlogDelete("");
                    message.success(data.message);
                })
                .catch(() => {
                    setIsDeleteOpen(false);
                    setBlogDelete("");
                    message.error("Có lỗi khi xóa blog!");
                })
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    useEffect(() => {
        getAllBlog()
            .then((data: any) => {
                setDataSource(data);
            })
            .catch(() => {
                logout();
                navigate("/admin/login");
                console.error('Failed to fetch blog information');
            });
    }, [navigate, blogDelete])

    interface DataType {
        id: string;
        userName: string;
        name: string;
        content: string;
        image: string;
        createdAt: string;
        shortContent: string;
        slug: string;
        categoryId: number;
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tiêu đề bài viết',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Người cập nhật',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => buttonUpdate(record.slug)}>Sửa</Button>
                        <Button danger onClick={() => buttonDelete(record.id)}>Xóa</Button>
                        <Button href={`/blog/${record.slug}`} target='_blank'>Xem</Button>
                    </Space>
                )
            }
        }
    ];

    return (
        <div>

            <Button href={routes.ADMIN_BLOGS_ADDNEW} className='mb-4' danger icon={<PlusOutlined />}>
                Thêm bài viết
            </Button>

            <Table rowKey="id" columns={columns} dataSource={dataSource} />

            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Xóa bài viết!"
                open={isDeleteOpen}
                onOk={doDelete}
                onCancel={cancelDelete}
                okText="Xóa"
            >
                <div className='flex flex-col items-center'>

                </div>
            </Modal>
        </div>
    )
}

export default Blogs;