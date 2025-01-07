import React, { useEffect, useMemo, useState } from 'react';
import { Message } from '../../ViewerProps';
import { PrefixCls, MessageType } from '../../constants';
import './index.scss';
import { formatDate } from '../../utils/tools/DataTools';
interface MessageItemProps {
    message?: Message;
    children: React.ReactNode;
    showEmotion?: boolean;
}
const defaultAvatar = '//pages.ctrip.com/iquality/static/img/defaultHeader.png';
export default (props: MessageItemProps) => {
    const {
        message: {
            createTime,
            nickname,
            avatar,
            messageBody,
            msgtype,
        } = {},
    } = props;
    let formatCreateTime = formatDate(createTime);
    const msgBodyContent = useMemo(() => {
        return messageBody ? (msgtype === MessageType.CustomContentMessage
            ? JSON.parse(messageBody) : messageBody) : null;
    }, [messageBody, msgtype]);
    const showEmotion = useMemo(() => {
        let returnFlag = false;
        if (msgBodyContent) {
            if (msgBodyContent.action === 'CBZ05') {
                returnFlag = true;
            }
        }
        return returnFlag;
    }, [msgBodyContent]);

    const showCard = useMemo(() => {
        let returnFlag = false;
        if (msgBodyContent &&
            msgtype === MessageType.CustomContentMessage) {
            const {
                ext: {
                    type,
                },
            } = msgBodyContent;
            let needCardTyles = ['history'];
            if (needCardTyles.includes(type)) {
                returnFlag = true;
            }
        }
        return returnFlag;
    }, [msgBodyContent, msgtype]);
    const [srcAvatar, setSrcAvatar] = useState("");
    useEffect(() => {
        if (avatar) {
            setSrcAvatar(avatar)
        } else {
            setSrcAvatar(defaultAvatar)
        }
    }, [avatar])
    return (
        <div className={`${PrefixCls}-item`}>
            {/* 头像模块 */}
            <div className={`${PrefixCls}-item-avatar`}>
                <img src={srcAvatar} alt="" className={`${PrefixCls}-item-avatar-img`} onError={() => { setSrcAvatar(defaultAvatar); }} />
            </div>
            <div className={`${PrefixCls}-item-content`}>
                <div className={`${PrefixCls}-user-date-wrapper`}>
                    <div className={`${PrefixCls}-user-nickName`}>{nickname}</div>
                    <div className={`${PrefixCls}-date-sendTime`}>{formatCreateTime}</div>
                </div>
                <div className={`${PrefixCls}-item-msg-content
                ${showEmotion ? 'emotion-content' : ''}
                ${showCard ? 'card-content' : ''}
                `}
                >
                    {props.children}
                </div>
            </div>
        </div>
    );
};
