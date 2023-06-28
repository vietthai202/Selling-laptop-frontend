import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useCallback, useState } from 'react';

interface DeleteModalProps {
    id: string;
    onDelete: (id: string, onSuccess: () => void) => void;
    onSuccess: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ id, onDelete, onSuccess }) => {

    const [visible, setVisible] = useState(false);

    const showModal = useCallback(() => {
        setVisible(true);
    }, []);

    const handleOk = useCallback(() => {
        onDelete(id, () => {
            onSuccess();
            setVisible(false);
        });
    }, [id, onDelete, onSuccess]);

    const handleCancel = useCallback(() => {
        setVisible(false);
    }, []);

    return (
        <>
            <Button danger icon={<DeleteOutlined />} onClick={showModal}>
                Xóa
            </Button>
            <Modal
                okButtonProps={{ style: { backgroundColor: '#CD1818' } }}
                title="Xác nhận xóa"
                open={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="OK"
                cancelText="Cancel"
            >
                <p>Bạn có muốn xóa?</p>
            </Modal>
        </>
    );
};

export default DeleteModal;
