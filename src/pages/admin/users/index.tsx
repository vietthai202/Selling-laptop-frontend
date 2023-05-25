import { Button, DatePicker, Form, Input, Modal, Space, Table, Tag, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logout } from '../../../services/auth';
import { deleteUser, getAllUser, updateUser } from '../../../services/user';
import { IUser } from '../../../types/auth';

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(customParseFormat);

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

const Users: React.FC = () => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);

    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [userDelete, setUserDelete] = useState<string>("");
    const [userUpdate, setUserUpdate] = useState<IUser>();
    const [formValue, setFromValue] = useState<any>();

    const buttonUpdate = async (username: string) => {
        await getUserInfo(username)
            .then((data: IUser) => {
                setUserUpdate(data);

                setFromValue(
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        dateOfBirth: dayjs(data.dateOfBirth)
                    }
                )

                setIsUpdateOpen(true);
            });
    }

    const doUpdate = async () => {
        form
            .validateFields()
            .then((values: any) => {
                if (userUpdate) {
                    const newUser: IUser = userUpdate;
                    newUser.name = values.name;
                    newUser.email = values.email;
                    newUser.phone = values.phone;
                    newUser.address = values.address;
                    newUser.dateOfBirth = values.dateOfBirth.$d;
                    updateUser(newUser.username, newUser)
                        .then((data: string) => {
                            message.success("Cập nhật thành công!");
                        }).catch(() => {
                            message.error("Cập nhật thất bại!");
                        }).finally(() => {
                            setIsUpdateOpen(false);
                            form.resetFields();
                        })
                }
            })
            .catch((errorInfo) => {
                message.error("Có lỗi kìa!!!");
                console.log('Form validation failed:', errorInfo);
            });
    }

    const cancelUpdate = () => {
        form.resetFields();
        setIsUpdateOpen(false);
    }

    const buttonDelete = (username: string, role: string) => {
        if (role === "ROLE_ADMIN") {
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
                .catch((err: any) => {
                    setIsDeleteOpen(false);
                    setUserDelete("");
                    message.error("Có lỗi khi xóa user!");
                })
        }
    }

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    useEffect(() => {
        setLoading(true);
        getAllUser()
            .then((data: any) => {
                setDataSource(data);
            })
            .catch(() => {
                logout();
                navigate("/login");
                console.error('Failed to fetch user information');
            }).finally(() => {
                setLoading(false);
            });
    }, [navigate, userDelete, userUpdate, isUpdateOpen]);

    useEffect(() => {
        if (userUpdate)
            form.setFieldsValue(formValue);
    }, [form, formValue, userUpdate]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
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
                if (role === 'ROLE_ADMIN') {
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

            <Table rowKey="id" columns={columns} dataSource={[...dataSource]} loading={loading} />

            <Modal
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Cập nhật user!"
                open={isUpdateOpen}
                onOk={doUpdate}
                onCancel={cancelUpdate}
                okText="Cập nhật"
            >
                <div className='flex flex-col items-center'>
                    {userUpdate &&
                        <Form
                            preserve={false}
                            form={form}
                            name="updateForm"
                            layout="vertical"
                            labelCol={{ span: 8 }}
                            style={{ minWidth: 400 }}
                            initialValues={formValue}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Hãy nhập tên!' }]}
                            >
                                <Input size="large" placeholder='Nguyễn Văn A' />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ email"
                                name="email"
                                rules={[{ required: true, message: 'Hãy nhập email!', type: "email" }]}
                            >
                                <Input size="large" disabled placeholder='example@gmail.com' />
                            </Form.Item>

                            <Form.Item
                                label="Điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Hãy nhập email!' }]}
                            >
                                <Input size="large" placeholder='+84352918986' />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: false, message: 'Hãy nhập địa chỉ!' }]}
                            >
                                <Input size="large" placeholder='Địa chỉ, nơi ở...' />
                            </Form.Item>

                            <Form.Item
                                label="Ngày sinh"
                                name="dateOfBirth"
                                rules={[{ required: true, message: 'Ngày sinh!' }]}
                            >
                                <DatePicker format="DD-MM-YYYY" size="large" />
                            </Form.Item>
                        </Form>
                    }
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