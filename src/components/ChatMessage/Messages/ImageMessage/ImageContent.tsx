import React, { useMemo } from 'react';
import { PrefixCls } from '../../constants';
import './index.scss';
interface ImageMessageProps {
    messageBody: string;
}
interface MessageProps {
    message: ImageMessageProps;
}

export default (props: MessageProps) => {
    const {
        message: propsMsg,
    } = props;
    let curImg = useMemo(() => {
        const {
            messageBody = '',
        } = propsMsg;
        return messageBody ? JSON.parse(messageBody) : {};
    }, [propsMsg]);
    const previewImg = (src: string) => {
        // } else {
        window.open(src, '_blank');
    };
    return (
        <>
            <div className={`${PrefixCls}-imgmsg`}>
                <img
                    src={curImg.thumbUrl || curImg.imageUrl || curImg.url}
                    alt=""
                    className={`${PrefixCls}-imgmsg-img`}
                    style={{
                        width: curImg.width,
                        height: curImg.height,
                    }}
                    onClick={() => { previewImg(curImg.originImageUrl || curImg.imageUrl || curImg.url); }}
                />
            </div>
        </>
    );
};
