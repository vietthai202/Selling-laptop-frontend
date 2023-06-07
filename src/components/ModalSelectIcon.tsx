import { Col, Modal, Row } from 'antd';
import React from 'react';
import { IconItem, iconList } from '../utils/icon';

interface IconSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectIcon: (iconName: string) => void;
}

const IconSelectionModal: React.FC<IconSelectionModalProps> = ({ visible, onClose, onSelectIcon }) => {
    const icons: IconItem[] = iconList;

    const handleIconSelect = (iconName: string) => {
        onSelectIcon(iconName);
    };

    return (
        <Modal
            open={visible}
            title="Chọn Icon"
            onCancel={onClose}
            footer={null}
        >
            <Row gutter={[16, 16]}>
                {icons.map((icon) => (
                    <Col span={6} key={icon.name}>
                        <div
                            className="flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => handleIconSelect(icon.name)}
                        >
                            <div className="text-center">
                                {React.createElement(icon.icon, { size: 24 })}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default IconSelectionModal;
