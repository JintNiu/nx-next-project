import React, { useRef } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default ({ defaultValue, placeholder, onChange, style, onPressEnter }) => {
    const composition = useRef(false);

    const onInputChange = (e) => {
        if (!composition.current) {
            onChange && onChange(e.target.value);
        }
    }
    const onCompositionStart = () => {
        composition.current = true;
    }
    const onCompositionEnd = (e) => {
        composition.current = false;
        onChange && onChange(e.target.value);
    }

    return (
        <Input
            // value={value}
            defaultValue={defaultValue}
            style={style}
            placeholder={placeholder}
            prefix={<SearchOutlined />}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            onChange={onInputChange}
            allowClear
            onPressEnter={onPressEnter}
        />
    )
}