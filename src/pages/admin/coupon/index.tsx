import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Spin, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';
import {  deleteCo,getAllCo } from '../../../services/coupon';
import { ICoupon } from '../../../types/coupon';
const Coupon: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [dataSource, setDataSource] = useState([]);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [couponDelete, setCouponDelete] = useState<string>("");

    const buttonUpdate = (slug: string) => {
        navigate(`/admin/coupon/edit/${slug}`);
    }

    const buttonDelete = (id: string) => {
        setIsDeleteOpen(true);
        setCouponDelete(id);
    }

    const doDelete = () => {
        if (couponDelete) {
            deleteCo(couponDelete)
                .then((data: any) => {
                    setIsDeleteOpen(false);
                    setCouponDelete("");
                    message.success(data.message);
                })
                .catch(() => {
                    setIsDeleteOpen(false);
                    setCouponDelete("");
                    message.error("Có lỗi khi xóa phiếu giảm giá!");
                })
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    const fetchData = async () => {
        setLoading(true);
        await getAllCo()
            .then((data: any) => {
                console.log(data);
                setDataSource(data);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
    }, [navigate, couponDelete])

    const columns: ColumnsType<ICoupon> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'CODE',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            key: 'discount',
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
            <Button href={routes.ADMIN_COUPON_ADDNEW} className='mb-4' danger icon={<PlusOutlined />}>
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

export default Coupon;