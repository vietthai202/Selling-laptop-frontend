import React from 'react';
import { IconType } from 'react-icons';
import { IconItem, iconList } from '../utils/icon';

interface IconProps {
    name: string;
    type?: IconType;
    size?: number;
    className?: string;
    onClick?: () => void;
}

const ShowIcon: React.FC<IconProps> = ({ name, type, size, className, onClick }) => {
    const iconItem: IconItem | undefined = iconList.find((item) => item.name === name);
    const IconComponent: IconType | null = type || (iconItem ? iconItem.icon : null);

    if (IconComponent && typeof IconComponent === 'function') {
        const iconSize = size ? { fontSize: `${size}px` } : {};

        return <IconComponent style={iconSize} className={className} onClick={onClick} />;
    }


    return null;
};

export default ShowIcon;
