import React, { useMemo } from 'react';
import './index.scss';
import { PrefixCls } from '../../../../constants';

import i18n from '../../../../utils/i18n/I18nUtil';
import DefaultMessage from '../../../DefaultMessage';
interface MessageProps {
    historyList: {
        combineType: string,
        desc: string,
        id: string,
        srcJid: string,
        srcName: string,
        srcType: string,
        type: string,
    };
    showCite?: boolean;
    onClick?: any; // 暂时预留
    language?: string;
}
export default (props: MessageProps) => {
    const {
        historyList: propsHistoryList,
        showCite: propsShowCite = false,
        onClick: propsOnClick = () => { },
        language: propsLan,
    } = props;
    const title = useMemo(() => {
        const {
            srcType = '',
            srcName = '',
        } = propsHistoryList;
        if (srcType === 'groupchat') {
            return i18n(propsLan, 'chatHistoryTitleGroup');
        }
        return i18n(propsLan, 'chatHistoryTitle').replace('$1', srcName);
    }, [propsHistoryList]);
    const desc = useMemo(() => {
        return propsHistoryList.desc || '';
    }, [propsHistoryList]);
    const openNewHistory = () => {
        // 判断外层是否有点击事件传入
        if (propsOnClick) {
            propsOnClick && propsOnClick(propsHistoryList);
        } else {
            window.open(`${window.location.href}#/id=${propsHistoryList.id}&srcJid=${propsHistoryList.srcJid}`, '_blank');
        }
    };
    return (
        !propsShowCite ? (
            <div className={`${PrefixCls}-history-card`} onClick={openNewHistory}>
                {/* 遮罩层 */}
                <div className={`${PrefixCls}-history-mask`}></div>
                {/* title */}
                <div className={`${PrefixCls}-title-wrapper`} title={title}>
                    {title}
                </div>
                {/* content */}
                <div className={`${PrefixCls}-content-wrapper`}>
                    <div className={`${PrefixCls}-content-desc`}>{desc}</div>
                </div>
                {/* 聊天记录footer */}
                <div className={`${PrefixCls}-footer-wrapper`}>
                    {i18n(propsLan, 'historyViewer')}
                </div>
            </div>
        ) : <DefaultMessage showCite={propsShowCite} showContent={i18n(propsLan, 'historyViewer')}></DefaultMessage>

    );
};
