import React, { useMemo } from 'react';
import { Message } from '../../ViewerProps';
import { PrefixCls } from '../../constants';
import './index.scss';
import CiteItemMsg from './ItemCite';
interface MessageProps {
    message: Message;
    language: string;
}

export default (props: MessageProps) => {
    const {
        message: propsMsg,
        language: propsLan
    } = props;
    const msgContent = useMemo(() => {
        return propsMsg.messageBody ? JSON.parse(propsMsg.messageBody) : null;
    }, [propsMsg]);
    // 引用的消息
    const msgCiteContent = useMemo(() => {
        if (msgContent && msgContent.cite) {
            return msgContent.cite;
        }
        return null;
    }, [msgContent]);
    // 消息体的消息
    const msgReplyContent = useMemo(() => {
        if (msgContent && msgContent.reply) {
            return msgContent.reply;
        }
        return null;
    }, [msgContent]);
    return (
        <>
            <div className={`${PrefixCls}-message-cite-content`}>
                <CiteItemMsg contentMsg={msgCiteContent} language={propsLan} />
                <CiteItemMsg contentMsg={msgReplyContent} showReply={true} language={propsLan} />
            </div>
        </>
    );
};
