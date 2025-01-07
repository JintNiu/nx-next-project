import React from 'react';
import { Message } from '../../ViewerProps';
import MessageItem from '../MessageItem';
import CustomContentMessage from './CustomContent';
interface MessageProps {
    message: Message;
    onClick?: any;
    language?: string
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        onClick: propsClick,
        language: propsLan
    } = props;
    return <MessageItem message={propsMsg}>
        <CustomContentMessage
            message={propsMsg}
            onClick={propsClick}
            language={propsLan}
        ></CustomContentMessage>
    </MessageItem>;
};
