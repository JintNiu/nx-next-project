import React, { useMemo } from 'react';
import { User } from '../../ViewerProps';
import { PrefixCls } from '../../constants';
// import { CommonEnum } from '../../utils/lib/cchat-imclient/index';
import { MessageType } from '../../constants';
import { renderTextEmoji, renderEmoji, linkifyString, handleAtMessage } from '../../utils/tools/DataTools';
import './index.scss';
interface TextMessageProps {
    messageBody: string;
    mid?: string;
    msgtype: number;
    nickname: string;
    uid: string;
}
interface MessageProps {
    message: TextMessageProps;
    users?: User[];

}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        users: propsUsers = [],
    } = props;
    // 需要判断当前是否包含@
    const isAt = useMemo(() => {
        return propsMsg.msgtype === MessageType.AtMessage;
    }, [propsMsg]);
    // message的主体
    const messageContent = useMemo(() => {
        const {
            messageBody = '',
        } = propsMsg;
        if (isAt) {
            return messageBody ? JSON.parse(messageBody) : {};
        } else {
            return messageBody;
        }
    }, [propsMsg]);
    // at的用户列表
    const atNames = useMemo(() => {
        if (isAt) {
            const { uid = [] } = messageContent;
            return uid.map((uidItem: any) => {
                let nameItem = propsUsers.find(propsUser => (propsUser.uid === uidItem));
                return {
                    uidItem,
                    name: nameItem ? nameItem.name : '',
                };
            }).filter((item: any) => item.uid !== '0');
        }
        return [];
    }, [messageContent, isAt, propsUsers]);

    // 渲染Text
    const renderText = useMemo(() => {
        let formatContent = '';
        if (isAt) {
            let {
                body: messageContentBody = '',
            } = messageContent;
            formatContent = atNames.reduce((result: any, nameObject: any) => {
                const { name } = nameObject;
                if (!name) { return result; }
                const isStartWithAt = name.startsWith('@');
                let rName = isStartWithAt ? name : `@${name}`;
                result = result.replaceAll(rName, ` ${rName}`);
                return result;
            }, messageContentBody || '');
            formatContent = formatContent.trim(); // 去除空格
        } else {
            formatContent = messageContent;
        }
        return renderTextEmoji(
            renderEmoji(linkifyString(formatContent)),
        ).replace(/\n/g, '<br/>');
    }, [isAt, messageContent]);
    const renderAtText = useMemo(() => {
        // 当前是@消息类型，需要对消息体进行数据处理
        if (isAt) {
            return handleAtMessage(
                renderText,
                atNames,
                '', // 传入当前用户的id，判断是否是@自己
            );
        } else {
            return [];
        }
    }, [renderText, atNames]);
    return (
        <>
            {
                isAt ? (
                    <div className={`${PrefixCls}-txtmsg`}>
                        {
                            renderAtText.map((itemText: any, indexText: number) => {
                                const {
                                    atItem,
                                    text,
                                } = itemText;
                                if (atItem) {
                                    return <span className="is-at" key={indexText}>{text}</span>;
                                } else {
                                    return <span key={indexText} dangerouslySetInnerHTML={{ __html: text }}></span>;
                                }
                            })
                        }
                    </div>
                ) : (
                    <div className={`${PrefixCls}-txtmsg`}
                        dangerouslySetInnerHTML={{ __html: renderText }}>
                    </div>
                )
            }
        </>
    );
};
