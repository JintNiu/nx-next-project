import React, { } from 'react';
import { Message } from '../../ViewerProps';
import MessageItem from '../MessageItem';
import CiteMessage from './CiteContent';
interface MessageProps {
    message: Message;
    language: string;
}

export default (props: MessageProps) => {
    const {
        message: propsMsg,
        language: propsLan
    } = props;
    return <MessageItem
        message={propsMsg}>
        <CiteMessage message={propsMsg} language={propsLan}></CiteMessage>
    </MessageItem>;
};
