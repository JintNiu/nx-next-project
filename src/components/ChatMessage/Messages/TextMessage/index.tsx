import React, { useMemo } from 'react';
import { User, Message } from '../../ViewerProps';
import MessageItem from '../MessageItem';
import TextMessage from './TextContent';
interface MessageProps {
    message: Message;
    users?: User[];
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        users: propsUsers,
    } = props;
    // 需要判断当前是否包含@
    const TextMsgProps = useMemo(() => {
        return {
            messageBody: propsMsg.messageBody,
            mid: '',
            msgtype: propsMsg.msgtype,
            nickname: propsMsg.nickname,
            uid: propsMsg.uid,
        };
    }, [propsMsg]);

    return <MessageItem message={propsMsg} >
        <TextMessage message={TextMsgProps} users={propsUsers}></TextMessage>
    </MessageItem>;
};
