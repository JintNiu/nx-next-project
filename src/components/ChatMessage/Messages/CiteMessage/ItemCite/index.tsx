import React, { useCallback } from 'react';
import { PrefixCls, MessageType } from '../../../constants';
import TextMessage from '../../TextMessage/TextContent';
import ImageMessage from '../../ImageMessage/ImageContent';
import CustomContentMessage from '../../CustomContentMessage/CustomContent';
import VideoMessage from '../../VideoMessage/VideoContent';
import FileMessage from '../../FileMessage/FileContent';
import AudioMessage from '../../AudioMessage/audioContent';
import DefaultMessage from '../../DefaultMessage';
import './index.scss';
interface CiteItemMsg {
	body: string;
	mid: string;
	msgtype: number;
	nick: string;
	uid: string;
}
interface CiteMsgProps {
	contentMsg: CiteItemMsg;
	showReply?: boolean;
	language: string;
}
export default (props: CiteMsgProps) => {
	const {
		contentMsg: propsMsg,
		showReply: propsShowRply = false,
		language: propsLan
	} = props;
	const MsgContent = useCallback(() => {
		let returnContent = null;
		const { msgtype = '' } = propsMsg || {};
		switch (msgtype) {
			// 文本消息类型 --- 根据users的范围，查询@的用户的信息
			case MessageType.TextMessage:
			// 单纯文本消息
			case MessageType.AtMessage: { // @类型的消息
				let textMsg = {
					messageBody: propsMsg.body,
					mid: propsMsg.mid,
					msgtype: propsMsg.msgtype,
					nickname: propsMsg.nick,
					uid: propsMsg.uid,
				};
				let users: any[] = [];
				if (propsShowRply) {
					users = [
						{
							name: propsMsg.nick,
							nickname: propsMsg.nick,
							avatar: '',
							uid: propsMsg.uid,
						},
					];
				}
				returnContent = (
					<TextMessage message={textMsg} users={users}></TextMessage>
				);
				break;
			}
			// 图片消息类型
			case MessageType.ImageMessage: {
				let imgMsg = {
					messageBody: propsMsg.body,
				};
				returnContent = <ImageMessage message={imgMsg}></ImageMessage>;
				break;
			}
			// 自定义消息类型
			case MessageType.CustomContentMessage: {
				let customMsg = {
					messageBody: propsMsg.body,
				};
				returnContent = <CustomContentMessage
					message={customMsg}
					// users={[]}
					showCite={!propsShowRply ? true : false}
					language={propsLan}
				></CustomContentMessage>;
				break;
			}
			// 视频消息
			case MessageType.VideoMessage: {
				let videoMsg = {
					messageBody: propsMsg.body,
				};
				returnContent = <VideoMessage message={videoMsg}></VideoMessage>;
				break;
			}
			// // 音频消息类型
			case MessageType.AudioMessage: {
				let audioMsg = {
					messageBody: propsMsg.body,
				};
				returnContent = <AudioMessage
					message={audioMsg}
					showCite={!propsShowRply ? true : false}
					language={propsLan}
				></AudioMessage>;
				break;
			}
			// // 文件消息
			case MessageType.FileMessage: {
				let fileMsg = {
					messageBody: propsMsg.body,
				};
				returnContent = <FileMessage
					message={fileMsg}
					language={propsLan}
					showCite={!propsShowRply ? true : false}></FileMessage>;
				break;
			}
			default: {
				returnContent = <DefaultMessage
					language={propsLan}
					showCite={true}></DefaultMessage>;
				break;
			}

		}
		return returnContent;
	}, [propsMsg]);
	return (
		// 如果是回复体的时候，样式上的区分
		<div className={`${propsShowRply ? 'trippal-message-reply-box' : 'trippal-message-cite-box'}`}>
			{(!propsShowRply && propsMsg) && <span className={`${PrefixCls}-cite-from-name`}>{propsMsg.nick}：</span>}
			<MsgContent />
		</div>
	);
};
