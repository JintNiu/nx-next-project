import React, { useMemo } from 'react';
import ImageMessage from './ImageContent';
import MessageItem from '../MessageItem';
import { Message } from '../../ViewerProps';
interface MessageProps {
    message: Message;
}

export default (props: MessageProps) => {
    const {
        message: propsMsg,
    } = props;
    let ImgMsgProps = useMemo(() => {
        return {
            messageBody: propsMsg.messageBody,
        };
    }, [propsMsg]);
    return <MessageItem message={propsMsg}>
        <ImageMessage message={ImgMsgProps} />
    </MessageItem>;
};
