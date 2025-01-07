import React from 'react';
import { PrefixCls } from '../../constants';
import './index.scss';
interface MessageProps {
    dateTime: string;
}

export default (props: MessageProps) => {
    const {
        dateTime: propsDateTime,
    } = props;
    return (
        <div className={`${PrefixCls}-date`}>
            <span>{propsDateTime}</span>
        </div>
    );
};
