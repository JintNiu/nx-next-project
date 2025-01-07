import React, { useMemo } from 'react';
import { PrefixCls } from '../../constants';
import FileIcon from '../../Components/FileIcon';
import prettyBytes from '../../utils/tools/prettyBytes';
import './index.scss';
import i18n from '../../utils/i18n/I18nUtil';
import DefaultMessage from '../DefaultMessage';
interface MessageProps {
    message: {
        messageBody: string;
    };
    showCite?: boolean;
    language?: string
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        showCite: propsShowCite = false,
        language: propsLan
    } = props;
    const messageBodyContent = useMemo(() => {
        const {
            messageBody,
        } = propsMsg;
        return messageBody ? JSON.parse(messageBody) : null;
    }, [propsMsg]);
    const msgFile = useMemo(() => {
        if (messageBodyContent && messageBodyContent.file) {
            return messageBodyContent.file;
        } else {
            return null;
        }
    }, [messageBodyContent]);
    const normalizeFileSize = useMemo(() => {
        return msgFile ? prettyBytes(msgFile.size) : null;
    }, [msgFile]);
    // const downLoadFile = (e, src) => {
    //     console.log('下载链接', msgFile.url);
    //     stopLink(e, src);
    // };
    const stopLink = (e: any, src: string) => {
        e.stopPropagation();
        e.preventDefault();
        window.open(src, '_blank');
        return false;
    };
    return (
        <>
            {
                propsShowCite || !msgFile ?
                    <span className={`${PrefixCls}-file-default-wrapper`}>
                        <DefaultMessage showCite={true} showContent={i18n(propsLan, 'file')} />
                        {msgFile && (msgFile.filename)}
                    </span> : (
                        <a href={msgFile.url}
                            onClick={(e) => { stopLink(e, msgFile.url); }}
                            className={`${PrefixCls}-file-down-wrapper`}>
                            <div className={`${PrefixCls}-message-file-content`}>
                                <div className={`${PrefixCls}-file-icon`}>
                                    <FileIcon fileName={msgFile.filename} />
                                </div>
                                <div className={`${PrefixCls}-file-main`}>
                                    <div className={`${PrefixCls}-file-info`}>
                                        <div
                                            className={`${PrefixCls}-file-name`}
                                            title={msgFile.filename}>
                                            {msgFile.filename}
                                        </div>
                                    </div>
                                    <div className={`${PrefixCls}-file-control`}>
                                        <div className="file-size">{normalizeFileSize}</div>
                                        <div className="file-control-action">
                                            {i18n(propsLan, 'download')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    )
            }
        </>
    );
};
