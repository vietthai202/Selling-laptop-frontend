/* eslint-disable no-template-curly-in-string */
import { Button, Card, DatePicker, Form, Input, Modal, message, Image } from "antd";
import { LockOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changePassword, getUserInfo, updateProfile } from "../../../services/user";
import { IUser } from "../../../types/auth";
import { password } from "../../../utils/validate";
import { logout } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
import UploadSingleImage from "../../../components/SingleUploadImage";

const TabEditProfile: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);
    const [user, setUser] = useState<IUser>();
    const [image, setImage] = useState<string>("");
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const [modal, setModal] = useState<boolean>(false);
    const [change, setChange] = useState<boolean>(false);

    const validateRepass: any = (_: any, value: string) => {
        const newpass = form2.getFieldValue('newpass');
        if (!value || newpass === value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mật khẩu nhập lại không khớp với mật khẩu mới!'));
    };

    const setShowChangePassword = () => {
        setModal(true);
    }

    const setHideChangePassword = () => {
        setModal(false);
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const doUpdatePassword = () => {
        form2
            .validateFields()
            .then((values: any) => {
                console.log(values);
                const token = localStorage.getItem("token") || "";
                if (token) {
                    changePassword(token, values.oldpass, values.newpass)
                        .then(() => {
                            message.success("Đổi mật khẩu thành công!")
                            form2.resetFields();
                            setHideChangePassword();
                        })
                        .catch(() => {
                            message.error("Đổi mật khẩu thất bại!")
                            form2.resetFields();
                            setHideChangePassword();
                        });
                }
            })
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const validateMessages = {
        required: '${label} là bắt buộc!',
        types: {
            email: '${label} không đúng định dạng email!',
            number: '${label} không đúng định dạng số!',
        },
        number: {
            range: '${label} phải ở trong khoảng ${min} tới ${max}',
        },
        pattern: {
            mismatch: '${label} không khớp với mẫu yêu cầu!',
        },
    };

    const onFinish = (values: any) => {
        console.log(values);
        if (user) {
            const token = localStorage.getItem("token") || "";
            const userEdit = user;
            userEdit.name = values.name;
            userEdit.dateOfBirth = values.dateOfBirth.$d;
            userEdit.address = values.address;
            userEdit.image = image;
            if (token) {
                updateProfile(token, userEdit)
                    .then(() => {
                        message.success("Cập nhật thành công!");
                        setChange(!change);
                    });
            }
        }
    };

    useEffect(() => {
        if (username) {
            getUserInfo(username)
                .then((data: IUser) => {
                    setUser(data);
                    console.log(data);
                    // setImage(data.image);
                    form.setFieldsValue({
                        ...data,
                        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : dayjs()
                    });
                })
        }
    }, [form, username, change]);

    return (
        <>
            <div className="container mx-3 space-x-2">
                <Card title="Chỉnh sửa tài khoản">
                    <div className="flex">
                        <div className="flex flex-col space-y-4 items-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex justify-center" >
                                <Image className="w-32 h-32 bg-gray-200 rounded-full flex justify-center" src={user?.image || "https://vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png"} />
                            </div>
                            <div className="">
                                <UploadSingleImage valueProps={image} setValueProps={setImage} />
                            </div>
                        </div>

                        <div className="md:flex">
                            <Form
                                className="flex-1"
                                form={form}
                                {...layout}
                                name="nest-messages"
                                onFinish={onFinish}
                                initialValues={user}
                                style={{ maxWidth: 600 }}
                                validateMessages={validateMessages}
                            >
                                <Form.Item
                                    name="name"
                                    label="Họ và tên"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                >
                                    <Input disabled />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Điện thoại"
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    name="dateOfBirth"
                                    label="Ngày sinh"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày sinh" className="w-full" />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                    rules={[{ required: true }]}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                    <Button danger type="primary" htmlType="submit" >
                                        Lưu thông tin
                                    </Button>
                                </Form.Item>

                            </Form>

                            <div className="md:ml-5 md:pl-5 md:border-0 md:border-l md:border-solid md:border-[#d9d9d9]">
                                <div>
                                    <div className="font-bold">Mật khẩu</div>
                                    <div className="flex space-x-2 items-center"><LockOutlined />  <div>*******</div>  <Button danger onClick={setShowChangePassword} size="small">Cập nhật</Button></div>
                                </div>
                                <div className="mt-5">
                                    <Button danger type="primary" onClick={handleLogout} size="small">Đăng xuất</Button>
                                </div>
                            </div>

                        </div>

                        <Modal
                            destroyOnClose={true}
                            okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                            title="Cập nhật mật khẩu!"
                            open={modal}
                            onOk={doUpdatePassword}
                            onCancel={setHideChangePassword}
                            okText="Cập nhật"

                        >
                            <Form
                                className="flex-1"
                                form={form2}
                                {...layout}
                                name="nest-messages"
                                initialValues={{}}
                                validateMessages={validateMessages}
                            >
                                <Form.Item
                                    name="oldpass"
                                    label="Mật khẩu cũ"
                                    rules={[{ required: true }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    name="newpass"
                                    label="Mật khẩu mới"
                                    rules={[{ required: true }, { pattern: password }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="repass"
                                    label="Nhập lại"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            validator: validateRepass,
                                        },
                                        {
                                            pattern: password
                                        }
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Form>

                        </Modal>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default TabEditProfile;