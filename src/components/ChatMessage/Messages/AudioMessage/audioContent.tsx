import React, { useMemo, useState } from 'react';
import { PrefixCls } from '../../constants';
import DefaultMessage from '../DefaultMessage';
import i18n from '../../utils/i18n/I18nUtil';
import Toast from '../../Components/Toast';
import './index.scss';
interface MessageProps {
    message: {
        messageBody: string,
    };
    language?: string
    showCite?: boolean;
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
        showCite: propsShowCite = false,
        language: propsLan
    } = props;
    const [showToast, setShowToast] = useState(false);
    const msgContent = useMemo(() => {
        const {
            messageBody,
        } = propsMsg;
        return messageBody ? JSON.parse(messageBody) : null;
    }, [propsMsg]);
    const playAudio = () => {
        setShowToast(true);
    };

    const closeShowToast = () => {
        setShowToast(false);
    };
    return (
        <>
            {
                propsShowCite || !msgContent ? <div className={`${PrefixCls}-audio-content`}>
                    <DefaultMessage
                        showCite={true}
                        showContent={`${i18n(propsLan, 'audio')}`} />
                </div> : (
                    <div className={`${PrefixCls}-audio-content`} onClick={playAudio}>
                        <div className={`${PrefixCls}-voice-content`}>
                            <div className="voice-symbol">
                                <div className="voice-circle first"></div>
                                <div className="voice-circle second"></div>
                                <div className="voice-circle third"></div>
                            </div>
                            <div className="voice-time">{msgContent.audio.duration}″</div>
                        </div>
                    </div>
                )
            }
            {/* 是否显示toast弹框 */}
            {
                showToast && <Toast show={showToast} close={closeShowToast} content={i18n(propsLan, 'notSupportFeatures')} />
            }
        </>
    );
};
