import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import { logout } from '../../../services/auth';
import { deleteBrand, getAllBrands } from '../../../services/brands';
import { IBrand } from '../../../types/brand';

const Slides: React.FC = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [brandDelete, setBrandDelete] = useState<string>("");

    const buttonUpdate = (slug: string) => {
        navigate(`/admin/brands/edit/${slug}`);
    }

    const buttonDelete = (blogid: string) => {
        setIsDeleteOpen(true);
        setBrandDelete(blogid);
    }

    const doDelete = () => {
        if (brandDelete) {
            deleteBrand(brandDelete)
                .then((data: any) => {
                    setIsDeleteOpen(false);
                    setBrandDelete("");
                    message.success(data.message);
                })
                .catch(() => {
                    setIsDeleteOpen(false);
                    setBrandDelete("");
                    message.error("Có lỗi khi xóa brand!");
                })
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    useEffect(() => {
        getAllBrands()
            .then((data: any) => {
                setDataSource(data);
            })
            .catch(() => {
                logout();
                navigate("/login");
                console.error('Failed to fetch blog information');
            });
    }, [navigate, brandDelete])

    const columns: ColumnsType<IBrand> = [
        {
            title: 'Thương hiệu',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Logo',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => {
                return (
                    <img className='w-48 h-20' src={record.image || "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"} alt='' />
                )
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => buttonUpdate(record.id.toString())}>Sửa</Button>
                        <Button danger onClick={() => buttonDelete(record.id.toString())}>Xóa</Button>
                    </Space>
                )
            }
        }
    ];

    return (
        <div>

            <Button href={routes.ADMIN_BRANDS_ADDNEW} className='mb-4' danger icon={<PlusOutlined />}>
                Thêm thương hiệu
            </Button>

            <Table rowKey="id" columns={columns} dataSource={dataSource} />

            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Xóa thương hiệu!"
                open={isDeleteOpen}
                onOk={doDelete}
                onCancel={cancelDelete}
                okText="Xóa"
            >
                <div className='flex flex-col items-center'>
                    Tất cả sản phẩm trong thương hiệu này sẽ tự động chuyển sang thương hiệu mặc định!
                </div>
            </Modal>
        </div>
    )
}

export default Slides;