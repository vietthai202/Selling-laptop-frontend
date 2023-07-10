import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table, Tag, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/auth';
import { createUser, deleteUser, getAllUser, getUserInfo, updateUser } from '../../../services/user';
import { IUser } from '../../../types/auth';
import { phone, password } from '../../../utils/validate';

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

const USER_ROLE = [
    {
        value: 'ROLE_ADMIN',
        label: 'ADMIN',
    },
    {
        value: 'ROLE_BLOG',
        label: 'BLOG MANAGER',
    },
    {
        value: 'ROLE_PRODUCT',
        label: 'PRODUCT MANAGER',
    },
    {
        value: 'ROLE_USER',
        label: 'DEFAULT USER',
    },
]

const Users: React.FC = () => {

    const [form] = Form.useForm();

    const [form2] = Form.useForm();

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [userDelete, setUserDelete] = useState<string>("");
    const [userUpdate, setUserUpdate] = useState<IUser>();
    const [formValue, setFormValue] = useState<any>();

    const buttonCreate = () => {
        setIsCreateOpen(true);
    }

    const doCreate = () => {
        form2
            .validateFields()
            .then((values: any) => {
                const userToCreate: IUser = {
                    id: 1,
                    name: values.name,
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    address: values.address,
                    phone: values.phone,
                    userRole: values.userRole.key,
                    dateOfBirth: values.dateOfBirth.$d,
                    image: values.image
                };

                console.log(userToCreate)
                createUser(userToCreate)
                    .then((data: any) => {
                        message.success(data.message);
                    })
                    .catch((data: any) => {
                        message.error("Có lỗi khi tạo user!");
                        console.log(data);
                    })
                    .finally(() => {
                        setIsCreateOpen(false);
                    })
            })
    }

    const cancelCreate = () => {
        form2.resetFields();
        setIsCreateOpen(false);
    }

    const buttonUpdate = async (username: string) => {
        await getUserInfo(username)
            .then((data: IUser) => {
                setUserUpdate(data);

                setFormValue(
                    {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        userRole: data.userRole,
                        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : dayjs()
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
                    newUser.userRole = values.userRole;
                    newUser.dateOfBirth = values.dateOfBirth.$d;
                    newUser.password = values.password;

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
            console.log(username);
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
                navigate("/admin/login");
                console.error('Failed to fetch user information');
            }).finally(() => {
                setLoading(false);
            });
    }, [navigate, userDelete, userUpdate, isUpdateOpen, isCreateOpen]);

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
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
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
                        {role}
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
            <Button className='mb-4' danger icon={<PlusOutlined />} onClick={() => { buttonCreate() }}>
                Thêm người dùng
            </Button>


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
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: false, message: 'Hãy nhập mật khẩu mạnh!', pattern: password }]}
                            >
                                <Input type='password' size="large" placeholder='Để trống nếu không muốn thay đổi' />
                            </Form.Item>

                            <Form.Item
                                label="ROLE"
                                name="userRole"
                                rules={[{ required: true, message: 'Hãy nhập role!' }]}
                            >
                                <Select
                                    options={USER_ROLE}
                                />

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
                destroyOnClose={true}
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Thêm mới user!"
                open={isCreateOpen}
                onOk={doCreate}
                onCancel={cancelCreate}
                okText="Tạo mới"
            >
                <div className='flex flex-col items-center'>
                    <Form
                        preserve={false}
                        form={form2}
                        name="createForm"
                        layout="vertical"
                        labelCol={{ span: 8 }}
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
                            <Input size="large" placeholder='example@gmail.com' />
                        </Form.Item>

                        <Form.Item
                            label="Tên tài khoản"
                            name="username"
                            rules={[{ required: true, message: 'Hãy nhập tên tài khoản!' }]}
                        >
                            <Input size="large" placeholder='username' />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Hãy nhập mật khẩu mạnh!', pattern: password }]}
                        >
                            <Input type='password' size="large" placeholder='*****' />
                        </Form.Item>

                        <Form.Item
                            label="ROLE"
                            name="userRole"
                            rules={[{ required: true, message: 'Hãy nhập role!' }]}
                        >
                            <Select
                                labelInValue
                                options={USER_ROLE}
                            />

                        </Form.Item>

                        <Form.Item
                            label="Điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Hãy nhập điện thoại!', pattern: phone }]}
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