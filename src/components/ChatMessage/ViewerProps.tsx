export interface Message {
  msgId: string;
  msgtype: number;
  conversationType: string;
  createTime: number;
  threadId: string | null;
  subject: string | null;
  fromJid: string;
  fromNick: string | null;
  messageBody: string;
  nickname?: string; // 用户昵称
  avatar?: string; // 用户头像
  uid?: string; // 用户UID
  timestamp?: string;
  // dateTime: string;
}

export interface User {
  name: string;
  nickname: string; // 用户昵称
  avatar: string; // 用户头像
  uid: string; // 用户UID
}

export interface ViewerData {
  messages: Message[];
  conversationJid: string;
  conversationType: string;
  conversationName: string;
  users: User[];
}

interface ViewerProps {
  data: ViewerData;
  language?: string;
  handleClickCustom?: any; // 自定义卡片的点击事件
  onHistoryClick?: any; // 自定义嵌套历史消息卡片的点击事件
}

export default ViewerProps;
