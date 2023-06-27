import { Button, Card, Checkbox, Form, Input, Modal, Radio, message } from "antd";
import { PlusOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IAddressReceive, IRA } from "../../../types/addressreceive";
import { createReceive, deleteReceiver, getReceiver, getReceiverById, updateReceiver, updateReceiverByDefaulAddress } from "../../../services/addressreceiver";
import { getUserInfo } from "../../../services/user";
import { IUser } from "../../../types/auth";
import { phone } from "../../../utils/validate";

const TabAddressReceive: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);
    const [receiver, setReceiver] = useState<IRA>();
    const [receiveData, setReceiveData] = useState([]);
    const [modal, setModal] = useState<boolean>(false);
    const [change, setChange] = useState<boolean>(false);
    const [modalUpdateAddress, setModalUpdateAddress] = useState<boolean>(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteReceive, setDeleteReceive] = useState<string>("");

    const [idUpdate, setIdUpdate] = useState<number>();

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const doUpdate = () => {
        if (username) {
            if (receiver) {
                const token = localStorage.getItem("token" || "");
                if (token) {
                    const receiverEdit: IAddressReceive = {
                        id: form2.getFieldValue("id"),
                        name: form2.getFieldValue("name"),
                        phone: form2.getFieldValue("phone"),
                        address: form2.getFieldValue("address"),
                        user_id: receiver.user_id,
                        defaultaddress: false,
                        token: token,
                        userName: username
                    }
                    console.log(receiverEdit)
                    updateReceiver(receiverEdit)
                        .then(() => {                    
                            message.success("Cập nhật thành công");
                            form2.resetFields();
                            onCancel();
                        })
                        .catch(() => {
                            message.error("Cập nhật thất bại");
                            form2.resetFields();
                            onCancel();
                        })
                }
            }
        }
    }

    const setDefaultAddress = (id: string) => {
        if (username) {
            updateReceiverByDefaulAddress(Number(id))
                .then(() => {
                    message.success("Đã chọn địa chỉ mặc định");
                    setChange(!change);
                })
                .catch(() => {
                    message.error("Thất bại");
                }
                )
        }
    }

    const buttonDelete = (id: string) => {
        setIsDeleteOpen(true);
        setDeleteReceive(id);
    }

    const doDelete = () => {
        if (deleteReceive) {
            deleteReceiver(deleteReceive)
                .then((data: any) => {
                    setIsDeleteOpen(false);
                    message.success(data.message);
                })
                .catch(() => {
                    setIsDeleteOpen(false);
                    message.error("Xảy ra lỗi khi xóa!!");
                });
        }
    };

    const cancelDelete = () => {
        setIsDeleteOpen(false);
    }

    const setAddress = () => {
        setModal(true);
    }

    const openUpdate = (id: string) => {
        setIdUpdate(Number(id))
        setModalUpdateAddress(true);
    }

    const onFinish = async () => {
        if (username) {
            getUserInfo(username)
                .then((data: IUser) => {
                    const myCheckbox = form.getFieldValue("myCheckbox");
                    const receive: IRA = {
                        name: form.getFieldValue("name"),
                        phone: form.getFieldValue("phone"),
                        address: form.getFieldValue("address"),
                        user_id: data.id,
                        defaultaddress: myCheckbox,
                        id: ""
                    };
                    createReceive(receive)
                        .then(() => {
                    
                            message.success("Thành công");
                            form.resetFields();
                            onCancel();
                        })
                        .catch(() => {
                            message.error("Thất bại");
                            form.resetFields();
                            onCancel();
                        });
                })

        }
    }

    const onCancel = () => {
        setModal(false);
        setModalUpdateAddress(false);
    }


    useEffect(() => {
        if (idUpdate) {
            getReceiverById(idUpdate)
                .then((data: IRA) => {
                    form2.setFieldsValue({
                        id: idUpdate,
                        name: data.name,
                        phone: data.phone,
                        address: data.address
                    })
                });

        }
    }, [modalUpdateAddress, idUpdate, form2]);

    useEffect(() => {
        if (username) {
            getUserInfo(username)
                .then((data: IUser) => {
                    if (data.id) {
                        getReceiver(data.id)
                            .then((data) => {
                                setReceiver(data);
                                console.log(data);
                                setReceiveData(data);
                            })
                    }

                })
        }
    }, [username, deleteReceive, modalUpdateAddress, isDeleteOpen, modal, change]);

    return (
        <>
            <div className="container mx-auto">
                <Card title="Sổ địa chỉ nhận hàng" extra={
                    receiveData.length > 0 &&
                    <Button type="primary" onClick={setAddress} danger shape="round" icon={<PlusOutlined />}>
                        Tạo mới
                    </Button>
                }>
                    <div className="">
                        {receiveData.length > 0 ? (
                            <div style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                {receiveData && receiveData.map((data: IRA) => (
                                    <div key={data.id} className="" >
                                        <ul className="divide-y divide-gray-300" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                            <li className="py-2 list-none" >
                                                <div className="flex justify-between items-center">
                                                    <span className="flex text-lg font-bold">{data.name} • {data.phone}</span>
                                                    <div className="flex">
                                                        <Button style={{ marginRight: '8px' }} onClick={() => { openUpdate(data.id) }}>Chỉnh sửa</Button>
                                                        <Button onClick={() => buttonDelete(data.id)} className="" danger>Xóa</Button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-lg">{data.address}</span>
                                                </div>
                                                <Radio checked={data.defaultaddress} onClick={() => setDefaultAddress(data.id)}>Chọn làm địa chỉ mặc định</Radio>
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div>Bạn chưa có địa chỉ nhận hàng nào</div>
                                    <Button type="primary" onClick={setAddress} danger shape="round" icon={<PlusOutlined />}>
                                        Tạo mới
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    <Modal
                        destroyOnClose={true}
                        okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                        title="Thêm địa chỉ nhận hàng"
                        open={modal}
                        onOk={onFinish}
                        onCancel={onCancel}
                        okText="Thêm"
                    >
                        <Form form={form} onFinish={onFinish}>
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: "Hãy nhập tên" }]}
                            >
                                <Input placeholder="Nhập tên" />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true,pattern: phone, message: "Hãy nhập số điện thoại" }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: "Hãy nhập địa chỉ" }]}
                            >
                                <Input placeholder="Nhập địa chỉ" />
                            </Form.Item>
                            <Form.Item
                               name="myCheckbox" 
                               valuePropName="checked"
                            >
                                <Checkbox>Chọn làm địa chỉ mặc định</Checkbox>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        destroyOnClose={true}
                        okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                        title="Cập nhật địa chỉ nhận hàng"
                        open={modalUpdateAddress}
                        onOk={doUpdate}
                        onCancel={onCancel}
                        okText="Cập nhật"
                    >

                        <Form
                            form={form2}
                            onFinish={doUpdate}>
                            <Form.Item
                                name="id"
                                className="hidden"
                            >
                                <Input type="hidden" />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: "Hãy nhập tên" }]}
                            >
                                <Input placeholder="Nhập tên" />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true,pattern:phone, message: "Hãy nhập số điện thoại" }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                                rules={[{ required: true, message: "Hãy nhập địa chỉ" }]}
                            >
                                <Input placeholder="Nhập địa chỉ" />
                            </Form.Item>
                        </Form>

                    </Modal>

                    <Modal
                        okButtonProps={{ style: { backgroundColor: "#CD1818" } }}
                        title="Xóa địa chỉ!"
                        open={isDeleteOpen}
                        onOk={doDelete}
                        onCancel={cancelDelete}
                        okText="Xóa"
                    >
                        <div className="flex flex-col items-center">
                            Bạn có chăc chắn xóa địa chỉ này!!
                        </div>
                    </Modal>
                </Card>
            </div>
        </>
    )
}

export default TabAddressReceive;