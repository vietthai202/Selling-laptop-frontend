import React, { useState, useEffect } from 'react';
import { Table, Space, Tag, Button, message, Modal } from 'antd';
import { deleteUser, getAllUser } from '../../services/user';
import { ColumnsType } from 'antd/es/table';
import { logout } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../types/auth';

const Users = () => {
    const navigate = useNavigate();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userDelete, setUserDelete] = useState<string>("");
    const [userUpdate, setUserUpdate] = useState<IUser>();

    const buttonUpdate = (username: string) => {
        setIsUpdateOpen(true);
        console.log(username);
    }

    const doUpdate = () => {
        console.log("OK");
    }

    const cancelUpdate = () => {
        setIsUpdateOpen(false);
    }

    const buttonDelete = (username: string, role: string) => {
        if (role === "ADMIN") {
            message.error("Không thể xóa admin khỏi hệ thống!");
        } else {
            setIsDeleteOpen(true);
            setUserDelete(username);
        }
    }

    const doDelete = () => {
        if (userDelete) {
            deleteUser(userDelete)
                .then((data: any) => {
                    setIsDeleteOpen(false);
                    setUserDelete("");
                    message.success(data.message);
                })
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        getAllUser()
            .then((data: any) => {
                setDataSource(data);
            })
            .catch((error: Error) => {
                logout();
                navigate("/login");
                console.error('Failed to fetch user information');
            });
    }, [navigate, userDelete])

    interface DataType {
        id: string;
        name: string;
        username: string;
        email: string;
        phone: string;
        age: number;
        address: string;
        userRole: string;
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tuổi',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'userRole',
            key: 'userRole',
            render: (role) => {
                let color = 'green';
                if (role === 'ADMIN') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={role}>
                        {role.toUpperCase()}
                    </Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => buttonUpdate(record.username)}>Update</Button>
                        <Button danger onClick={() => buttonDelete(record.username, record.userRole)}>Delete</Button>
                    </Space>
                )
            }
        }
    ];

    return (
        <div>
            <Table rowKey="id" columns={columns} dataSource={dataSource} />

            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Cập nhật user!"
                open={isUpdateOpen}
                onOk={doUpdate}
                onCancel={cancelUpdate}
                okText="Cập nhật"
            >
                <div className='flex flex-col items-center'>

                </div>
            </Modal>

            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Xóa user!"
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

export default Users;