import React, { useMemo } from 'react';
import './style/index.scss';
import ViewerProps, { Message, User } from './ViewerProps';
import { PrefixCls, MessageType, } from './constants';
import { dealMessageAddDate } from './utils/tools/MsgDateFormat';

// 聊天组件
import TextMessage from './Messages/TextMessage';
import DateMessage from './Messages/DateMessage';
import DefaultMessage from './Messages/DefaultMessage'
import ImageMessage from './Messages/ImageMessage'
import CustomContentMessage from './Messages/CustomContentMessage'
import VideoMessage from './Messages/VideoMessage';
import AudioMessage from './Messages/AudioMessage';
import FileMessage from './Messages/FileMessage';
import CiteMessage from './Messages/CiteMessage';

// 时间插件
import moment from 'moment';
export default (props: ViewerProps) => {
    const {
        data: {
            messages,
            users,
        },
        language: propsLan = 'zh',
        onHistoryClick: propsOnHistoryClick
    } = props;
    // 初始化时间
    moment.locale(propsLan === 'en' ? 'en-us' : 'zh-cn');
    const view: any[] = [];
    // messages的处理
    const formatMessages = (data: Message[], usersData: User[]): Message[] => {
        let originData = JSON.parse(JSON.stringify(data));
        let needData = originData.map((item: Message) => {
            const {
                fromJid, // 发送消息的imid
            } = item;
            let curUserItem = usersData.find((itemUser) => (itemUser.uid === fromJid));
            let returnItem = { ...item };
            if (curUserItem) {
                returnItem = {
                    ...returnItem,
                    ...curUserItem,
                };
            }
            return returnItem;
        });
        return needData;
    };
    let newMessages = useMemo(() => {
        let curNewMsgs = formatMessages(messages, users);
        let tempMsgs = dealMessageAddDate(curNewMsgs, "0", propsLan);
        return tempMsgs.msgs;
    }, [messages, users]);
    newMessages.forEach((message: Message) => {
        switch (message.msgtype) {
            // 展示消息的时间
            case MessageType.DateMessage: {
                // view.push(
                //     <DateMessage
                //         key={message.timestamp}
                //         dateTime={message.dateTime}></DateMessage>,
                // );
                break;
            }
            // 文本消息类型 --- 根据users的范围，查询@的用户的信息
            case MessageType.TextMessage: // 单纯文本消息
            case MessageType.AtMessage: { // @类型的消息
                view.push(
                    <TextMessage message={message} users={users} key={message.msgId}></TextMessage>
                );
                break;
            }
            // 图片消息类型
            case MessageType.ImageMessage: {
                view.push(
                    <ImageMessage message={message} key={message.msgId}></ImageMessage>,
                );
                break;
            }
            // 自定义消息类型
            case MessageType.CustomContentMessage: {
                view.push(
                    <CustomContentMessage
                        key={message.msgId}
                        message={message}
                        language={propsLan}
                        onClick={propsOnHistoryClick}
                    ></CustomContentMessage>,
                );
                break;
            }
            // 视频消息
            case MessageType.VideoMessage: {
                view.push(
                    <VideoMessage message={message} key={message.msgId}></VideoMessage>,
                );
                break;
            }
            // 音频消息类型
            case MessageType.AudioMessage: {
                view.push(
                    <AudioMessage
                        message={message}
                        key={message.msgId}
                        language={propsLan}
                    ></AudioMessage>,
                );
                break;
            }
            // // 文件消息
            // 文件消息
            case MessageType.FileMessage: {
                view.push(
                    <FileMessage
                        key={message.msgId}
                        message={message}
                        language={propsLan}></FileMessage>,
                );
                break;
            }
            // 引用消息  --- 引用消息里面不存在引用消息
            case MessageType.CiteMessage: {
                view.push(
                    <CiteMessage
                        message={message}
                        key={message.msgId}
                        language={propsLan}
                    ></CiteMessage>,
                );
                break;
            }
            default: {
                view.push(
                    <DefaultMessage
                        message={message}
                        key={message.msgId}
                        language={propsLan}></DefaultMessage>,
                );
                break;
            }
        }
    });
    return (
        <div className={`${PrefixCls}-wrapper`} id="ChatMessageWrapper">
            <div className={`${PrefixCls}-list`}>
                {view}
            </div>
        </div>
    )
}