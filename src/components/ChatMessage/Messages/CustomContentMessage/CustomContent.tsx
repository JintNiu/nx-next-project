import React, { useMemo } from 'react';
import { PrefixCls } from '../../constants';
import './index.scss';
import { sortDecoratesByIdx } from '../../utils/tools/DataTools';
import ImgTextMessage from './ItemCustom/ImgTextMessage';
import MarkDownMessage from './ItemCustom/MarkDownMessage';
import DynamicEmotionMessage from './ItemCustom/DynamicEmotionMessage';
import TableMessage from './ItemCustom/TableMessage';
import HistoryCardMessage from './ItemCustom/HistoryCardMessage';
import NewActionCardMessage from './ItemCustom/NewActionCardMessage';
import DefaultMessage from '../DefaultMessage';
interface CustomMessageProps {
    messageBody: string;
}
interface MessageProps {
    message: CustomMessageProps;
    showCite?: boolean;
    onClick?: any;
    language?: string;
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        showCite: propsShowCite = false,
        onClick: propsClick,
        language: propsLan,
    } = props;
    // 当前内容部分是否有
    // message的主体
    const messageContent = useMemo(() => {
        const {
            messageBody = '',
        } = propsMsg;
        return messageBody ? JSON.parse(messageBody) : {};
    }, [propsMsg]);
    // 消息类型
    const customContentType = useMemo(() => {
        if (!messageContent) {
            return;
        }
        const {
            action = '',
            ext: {
                type: extType = '',
            } = {},
        } = messageContent;
        let returnType;
        switch (action) {
            case 'CCL01':
                // 1.1.1 markdown Markdown类型消息 done
                // 1.1.2 table 表格类型消息 done
                // 1.1.3 schemaCard 带转跳的卡片类型消息
                // 1.1.4 history 消息历史记录类型消息 done
                // 1.1.5 url卡片类型消息
                if (extType === 'markdown') {
                    returnType = 'markDown';
                } else if (extType === 'table') {
                    returnType = 'table';
                } else if (extType === 'history') {
                    returnType = 'history';
                } else {
                    returnType = null;
                }
                break;
            case 'CCL11':
                returnType = 'richTxt'; // 图文富文本
                break;
            case 'CBZ05':
                returnType = 'dynamicEmotion'; // 动态表情包
                break;
            case 'CCL02':
                // 1.2.1 article 文章类型消息
                // 1.2.2 template 模板类型消息
                // 1.2.3 actionCard 交互卡片类型消息
                // 1.2.4 new ActionCard 交互卡片类型消息
                if (extType === 'newActionCard') {
                    returnType = 'newActionCard';
                } else {
                    returnType = null;
                }
                break;
            default:
                returnType = null;
                break;
        }
        return returnType;
    }, [messageContent]);

    // 图文混排的自定义消息
    const renderRichText = useMemo(() => {
        if (customContentType === 'richTxt') {
            let returnList;
            if (typeof (messageContent.ext.decorates) === 'object') {
                returnList = JSON.parse(JSON.stringify(messageContent.ext.decorates));
            }
            return sortDecoratesByIdx(returnList) || '';
        }
        return [];
    }, [customContentType, messageContent]);

    // markDown消息的处理
    const markDownText = useMemo(() => {
        if (customContentType === 'markDown') {
            let {
                ext: {
                    markdownSource,
                },
            } = messageContent;
            return markdownSource || '';
        }
        return '';
    }, [customContentType, messageContent]);

    // 动态表情包图
    const dynamicEmotionText = useMemo(() => {
        if (customContentType === 'dynamicEmotion') {
            let {
                ext,
            } = messageContent;
            return ext;
        }
        return {};
    }, [customContentType, messageContent]);

    // table数据
    const tableText = useMemo(() => {
        if (customContentType === 'table') {
            let {
                ext: {
                    tableList,
                },
            } = messageContent;
            return tableList;
        }
        return [];
    }, [customContentType, customContentType]);

    // 聊天记录的内容信息
    const historyText = useMemo(() => {
        if (customContentType === 'history') {
            let {
                ext,
            } = messageContent;
            return ext;
        }
        return [];
    }, [customContentType, customContentType]);
    // newActionCard 的内容消息
    const newActionCardText = useMemo(() => {
        if (customContentType === 'newActionCard') {
            let {
                ext,
            } = messageContent;
            return ext;
        }
        return null;
    }, [customContentType, customContentType]);
    return (
        <>
            <div className={`${PrefixCls}-imgtxtmsg
                ${customContentType === 'markDown' ? 'markdown-message-content' : ''}
                ${customContentType === 'history' ? 'card-has-footer' : ''}
                ${customContentType === 'newActionCard' ? 'card-no-padding' : ''}
                `}>
                {
                    customContentType ? (
                        <>
                            {customContentType === 'richTxt' &&
                                <ImgTextMessage
                                    msgList={renderRichText}
                                    showCite={propsShowCite}
                                    language={propsLan}
                                />
                            }
                            {customContentType === 'markDown' &&
                                <MarkDownMessage
                                    data={markDownText}
                                    showCite={propsShowCite} />
                            }
                            {
                                customContentType === 'dynamicEmotion' &&
                                <DynamicEmotionMessage
                                    data={dynamicEmotionText} />

                            }
                            {
                                customContentType === 'table' &&
                                <TableMessage
                                    tableList={tableText}
                                    showCite={propsShowCite}
                                    language={propsLan}
                                />
                            }
                            {
                                customContentType === 'history' &&
                                <HistoryCardMessage
                                    historyList={historyText}
                                    showCite={propsShowCite}
                                    onClick={propsClick}
                                    language={propsLan}
                                />
                            }
                            {
                                (customContentType === 'newActionCard'
                                    && newActionCardText) &&
                                <NewActionCardMessage
                                    newActionList={newActionCardText}
                                    showCite={propsShowCite}
                                    language={propsLan}
                                />
                            }
                        </>
                    ) : <DefaultMessage showCite={true} />
                }
            </div>
        </>
    );
};
