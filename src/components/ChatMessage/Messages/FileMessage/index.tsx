import React, { useMemo } from 'react';
import MessageItem from '../MessageItem';
import { Message } from '../../ViewerProps';
import FileMessage from './FileContent';
interface MessageProps {
    message: Message;
    language?: string;
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        language: propsLan
    } = props;
    const fileMsgProps = useMemo(() => {
        return {
            messageBody: propsMsg.messageBody,
        };
    }, [propsMsg]);
    return <MessageItem
        message={propsMsg}>
        <FileMessage message={fileMsgProps} language={propsLan}></FileMessage>
    </MessageItem>;
};
