// 消息体类型
const MessageType = {
    TextMessage: 0, // 单文本消息 done
    ImageMessage: 1, // 图片消息 done
    CardMessage: 2, // 卡片消息
    VideoMessage: 3, // 视频消息 done
    AudioMessage: 4, // 音频消息 done
    FileMessage: 5, // 文件消息 done
    LocationMessage: 6, // 位置消息
    CustomContentMessage: 7, // 自定义内容消息(图文混排，动态表情包，markDown，历史消息记录) doing
    EmoticonMessage: 8, // 表情包消息 done
    AtMessage: 9, // @消息 done
    TemplateMessage: 10, // 模板消息 ---
    CiteMessage: 11, // 引用消息
    NormalMessage: -1,
    SystemMessage: -2,
    StatusMessage: -3,
    InputStateMessage: -4,
    DateMessage: 10000, // 展示间隔的时间
};
// 对话类型
const ConversationType = {
    SingleChat: 'chat',
    GroupChat: 'groupchat',
    ConversationList: 'conversationList',
    Notice: 'headline',
    Error: 'error',
};

const BusinessType = {
    CTIMBusinessTypeNormal: 0,
    CTIMBusinessTypeGS: 1,
    CTIMBusinessTypeFlightAndHotelNormal: 2,
    CTIMBusinessTypeTour: 3,
    CTIMBusinessTypeHoliday: 4,
    CTIMBusinessTypeMaikol: 5,
    CTIMBusinessTypeGroup: 1000,
    CTIMBusinessTypeGroupFlightAndHotel: 1001,
    CTIMBusinessTypeUnTravelGroup: 1002,
};

// 样式前缀
const PrefixCls = 'chat-message';

export {
    MessageType,
    ConversationType,
    BusinessType,
    PrefixCls,
};
