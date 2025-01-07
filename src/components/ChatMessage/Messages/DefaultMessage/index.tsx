import React, { useMemo } from 'react';
import { Message } from '../../ViewerProps';
import MessageItem from '../MessageItem';

import './index.scss';

import i18n from '../../utils/i18n/I18nUtil';
interface MessageProps {
    message?: Message;
    showCite?: boolean;
    showContent?: string;
    language?: string;
}

export default (props: MessageProps) => {
    const {
        message: propsMsg,
        showCite: propsShowCite = false,
        showContent: propsShowContent,
        language: propsLan
    } = props;
    const showCurText = useMemo(() => {
        return propsShowContent || i18n(propsLan, 'notSupportMsgType');
    }, [propsShowContent]);
    return (
        !propsShowCite ? <MessageItem
            message={propsMsg}
        >
            <span className="default-message-text">[{showCurText}]</span>
        </MessageItem> : <span className="default-message-text">[{showCurText}]</span>
    );
};
