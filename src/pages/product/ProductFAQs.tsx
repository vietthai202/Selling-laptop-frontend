import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Typography, ConfigProvider } from 'antd';
import { CSSProperties, useState } from 'react';
import React from 'react';

const { Panel } = Collapse;
const { Text } = Typography;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const getPanels: (panelStyle: CSSProperties) => React.ReactNode = (panelStyle) => {
    const panelData = [
        { key: '1', header: 'This is panel header 1' },
        { key: '2', header: 'This is panel header 2' },
        { key: '3', header: 'This is panel header 3' },
    ];

    return panelData.map((item) => (
        <Panel
            key={item.key}
            header={item.header}
            style={panelStyle}
        >
            <Text>{text}</Text>
        </Panel>
    ));
};

const FAQs: React.FC = () => {
    const panelStyle: CSSProperties = {
        marginBottom: 24,
        background: '#f5f5f5',
        borderRadius: '4px',
        border: 'none',
    };

    const [activePanel, setActivePanel] = useState<string | string[]>(['1']);

    const handlePanelChange = (keys: string | string[]) => {
        setActivePanel(keys);
    };

    return (
        <ConfigProvider direction="ltr">
            <Collapse
                className='w-full'
                bordered={false}
                activeKey={activePanel}
                onChange={handlePanelChange}
                expandIcon={({ isActive }) => (
                    <CaretRightOutlined
                        className={`panel-arrow ${isActive ? 'panel-arrow-active' : ''}`}
                        rotate={isActive ? 90 : 0}
                    />
                )}
                style={{ background: '#ffffff' }}
            >
                {getPanels(panelStyle)}
            </Collapse>
        </ConfigProvider>
    );
};

export default FAQs;
