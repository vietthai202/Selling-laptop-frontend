import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Typography, ConfigProvider } from 'antd';
import { CSSProperties, useState } from 'react';
import React from 'react';
import { IFAQs } from '../types/faqs';

const { Panel } = Collapse;
const { Text } = Typography;

const getPanels: (panelStyle: CSSProperties, listFaq: IFAQs[]) => React.ReactNode = (panelStyle, listFaq) => {
    const panelData: IFAQs[] = [];
    if (listFaq.length === 0) {
        listFaq = panelData;
    }
    return listFaq.map((item) => (
        <Panel
            key={item.id}
            header={item.title}
            style={panelStyle}
        >
            <Text>{item.content}</Text>
        </Panel>
    ));
};

interface Props {
    listFaq: IFAQs[];
}

const FAQs: React.FC<Props> = ({ listFaq }) => {
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
                {getPanels(panelStyle, listFaq)}
            </Collapse>
        </ConfigProvider>
    );
};

export default FAQs;
