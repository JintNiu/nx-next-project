import moment from 'moment';
import i18n from '../i18n/I18nUtil';

import { Message } from '../../ViewerProps';
export const dateformat = (_ts: string, _lastts: string, language?: string): string => {
    let ts: number = parseInt(_ts, 10);
    let lastts: number = parseInt(_lastts, 10);
    const time = moment(ts);
    const now = moment();
    /*
    1.与上一条消息时间相差5分钟以内不出现
    2.今天的消息，显示hh:mm
    3.昨天的消息，显示 昨天 hh:mm
    4.一周以内的消息，显示 星期？ hh:mm
    5.更久之前的消息，显示 mm-dd hh:mm
    6.去年的消息，显示 yyyy-mm-dd hh:mm
    */
    if (ts - lastts < 0) {
        return 'error';
    }
    if ((ts - lastts) < 300 * 1000) {
        return '';
    }
    // return ts;
    if (time.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')) {
        return time.format('HH:mm');
    }
    if (time.format('YYYY-MM-DD') === moment(now).subtract(1, 'days').format('YYYY-MM-DD')) {
        return `${i18n(language, 'yesterday')} ${time.format('HH:mm')}`;
    }
    if (now.valueOf() - ts < 7 * 24 * 60 * 60 * 1000 && now.valueOf() - ts > 0) {
        return time.format('dddd HH:mm');
    }
    if (time.year() < now.year()) {
        return time.format('YYYY-MM-DD HH:mm');
    }
    return time.format('MM-DD HH:mm');
};
export const dealMessageAddDate = (messages: Message[], initLastMsgTime: string, language: string): any => {
    let lastMsgTime = initLastMsgTime; // 初始化最顶部的时间
    const msgs: any[] = [];
    messages.forEach((message: any) => {
        const historyTime = dateformat(message.createTime, lastMsgTime, language);
        if (historyTime !== 'error') {
            if (historyTime !== '') {
                msgs.push({
                    timestamp: message.createTime,
                    dateTime: historyTime,
                    isMessagesDate: true,
                    msgtype: 10000
                });
            }
            lastMsgTime = message.createTime;
        }
        msgs.push(message);
    });
    return {
        lastMsgTime,
        msgs,
    };
};
