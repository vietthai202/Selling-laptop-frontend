import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import { logout } from '../../../services/auth';
import { getAllProduct } from '../../../services/product';
import { IProduct } from '../../../types/product';

const AdminProducts: React.FC = () => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);

    const buttonUpdate = (slug: string) => {
        navigate(`/admin/products/edit/${slug}`);
    }


    useEffect(() => {

        getAllProduct()
            .then((data: any) => {
                console.log(data);
                setDataSource(data);
            }).catch(() => {
                logout();
                navigate("/admin/login");
                console.error('Failed to fetch blog information');
            });
    }, [navigate])

    const columns: ColumnsType<IProduct> = [
        {
            title: 'Tên laptop',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => {
                return (
                    <img className='w-40 h-24 border-solid border-1 border-[#7675756f] rounded-md' src={record.image ? record.image : "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"} alt='' />
                )
            }
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => buttonUpdate(record.slug.toString())}>Sửa</Button>
                        <Button onClick={() => navigate(`/product/${record.slug.toString()}`)}>Xem</Button>
                    </Space>
                )
            }
        }
    ];

    return (
        <div>

            <Button href={routes.ADMIN_PRODUCTS_ADDNEW} className='mb-4' danger icon={<PlusOutlined />}>
                Thêm sản phẩm
            </Button>

            <Table rowKey="id" columns={columns} dataSource={dataSource} />

            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Xóa thương hiệu!"
                okText="Xóa"
            >
                <div className='flex flex-col items-center'>
                    Tất cả sản phẩm trong thương hiệu này sẽ tự động chuyển sang thương hiệu mặc định!
                </div>
            </Modal>
        </div>
    )
}

export default AdminProducts;