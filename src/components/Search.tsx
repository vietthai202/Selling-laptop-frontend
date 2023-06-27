import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSearchData } from '../services/search';
import { ISearch } from '../types/search';
import { INewSearch } from './Header';

interface MySelectProps extends SelectProps<string> {
    options: { value: string; label: string; image: string; type: string }[];
    valueProps: INewSearch[];
    setDataNSearch: (value: INewSearch[]) => void;
}

const Search: React.FC<MySelectProps> = ({ options, valueProps, setDataNSearch, ...rest }) => {
    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const onSearch = (value: string) => {
        getAllSearchData(value.trim()).then((data: ISearch[]) => {
            const list: INewSearch[] = [];
            data && data.map((d: ISearch) => {
                const item: INewSearch = {
                    label: d.title,
                    value: d.slug,
                    image: d.image,
                    type: d.type
                }
                return list.push(item);
            })
            setDataNSearch(list);
            handleReset();
        })
    };


    const handleSelect = (value: string) => {
        const option = options.find((o) => o.value === value);

        if (option?.type === "laptop") {
            navigate("/product/" + option.value);
        }

        if (option?.type === "blog") {
            navigate("/blog/" + option.value);
        }

        handleReset();
        setDataNSearch([]);
    };

    const handleReset = () => {
        setSelectedValue(null);
    };

    const renderOption = (option: { value: string; label: string; image: string; type: string }) => {
        return (
            <div>
                {option.image && <img src={option.image} alt="" style={{ width: '32px', marginRight: '8px' }} />}
                {option.label}
            </div>
        );
    };

    return (
        <Select
            showSearch
            className='md:min-w-[350px] w-full mr-5'
            size='large'
            placeholder="Laptop gaming ..."
            filterOption={false}
            onSearch={onSearch}
            optionFilterProp="children"
            value={selectedValue}
            onSelect={handleSelect} {...rest}>
            {options.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    {renderOption(option)}
                </Select.Option>
            ))}
        </Select>
    );
};

export default Search;