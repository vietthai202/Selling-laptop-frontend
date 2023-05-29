import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Spin, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import { logout } from '../../../services/auth';
import { deleteProductCategory, getAllProductCategories } from '../../../services/productCategory';
import { IProductCategory } from '../../../types/productCategory';

const ProductCategories: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [dataSource, setDataSource] = useState([]);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [productCategoryDelete, setProductCategoryDelete] = useState<string>("");

    const buttonUpdate = (slug: string) => {
        navigate(`/admin/product-categories/edit/${slug}`);
    }

    const buttonDelete = (blogid: string) => {
        setIsDeleteOpen(true);
        setProductCategoryDelete(blogid);
    }

    const doDelete = () => {
        if (productCategoryDelete) {
            deleteProductCategory(productCategoryDelete)
                .then((data: any) => {
                    setIsDeleteOpen(false);
                    setProductCategoryDelete("");
                    message.success(data.message);
                })
                .catch(() => {
                    setIsDeleteOpen(false);
                    setProductCategoryDelete("");
                    message.error("Có lỗi khi xóa brand!");
                })
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    const fetchData = async () => {
        setLoading(true);
        await getAllProductCategories()
            .then((data: any) => {
                console.log(data);
                setDataSource(data);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
    }, [navigate, productCategoryDelete])

    const columns: ColumnsType<IProductCategory> = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
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
        <Spin tip="Loading...." spinning={loading}>
            <Button href={routes.ADMIN_PRODUCTCATEGORIES_ADDNEW} className='mb-4' danger icon={<PlusOutlined />}>
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
                    Tất cả sản phẩm trong danh mục này sẽ tự động chuyển sang danh mục mặc định!
                </div>
            </Modal>
        </Spin>
    )
}

export default ProductCategories;