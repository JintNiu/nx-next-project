
import React, { useMemo } from 'react';
import { Message } from '../../ViewerProps';
import MessageItem from '../MessageItem';
import AudioMessage from './audioContent';
interface MessageProps {
    message: Message;
    language?: string
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        language: propsLan
    } = props;
    const audioMsgProps = useMemo(() => {
        return {
            messageBody: propsMsg.messageBody,
        };
    }, [propsMsg]);
    return <MessageItem message={propsMsg}>
        <AudioMessage message={audioMsgProps} language={propsLan}></AudioMessage>
    </MessageItem>;
};