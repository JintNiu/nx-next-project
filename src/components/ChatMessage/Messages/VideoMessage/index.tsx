import React, { useMemo } from 'react';
import { Message } from '../../ViewerProps';
import MessageItem from '../MessageItem';
import VideoMessage from './VideoContent';
interface MessageProps {
    message: Message;
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
    } = props;
    const videoMsgProps = useMemo(() => {
        return {
            messageBody: propsMsg.messageBody,
        };
    }, []);
    return <MessageItem
        message={propsMsg}>
        <VideoMessage message={videoMsgProps}></VideoMessage>
    </MessageItem>;
};
