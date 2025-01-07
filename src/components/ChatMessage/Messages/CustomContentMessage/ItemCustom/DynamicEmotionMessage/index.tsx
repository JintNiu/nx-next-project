import React, { useMemo} from 'react';
import { PrefixCls } from '../../../../constants';
// import {StickerUtil} from '../../../../utils/tools/StickerUtil.js'
import './index.scss';
interface EmotionProps {
    emotionCoverUrl: string;
    emotionDes: string;
    emotionName: string;
    emotionType: string;
    emotionUrl: string;
    imageUrl: string;
    thumbUrl: string;
}

interface MessageProps {
    data: EmotionProps;
}

export default (props: MessageProps) => {
    const {
        data: propsMsg,
    } = props;
    // const isCustomSticker = useMemo(() => {
    //     return propsMsg.emotionType === "customSticker";
    // }, [propsMsg]);
    // const isGif = useMemo(() => {
    //     return propsMsg.emotionUrl && propsMsg.emotionUrl.endsWith === ".gif";
    // }, [propsMsg]);

    const emoticonUrl = useMemo(() => {
        // if (isCustomSticker) {
        //     return propsMsg.thumbUrl;
        //   }
        //   const localUrl = StickerManager.getLocalUrl(this.message.extPropertys.emotionType,
        //     this.message.extPropertys.emotionName);
        //   if (localUrl) {
        //     return localUrl;
        //   }
        //   const emojiUrl = StickerUtil.getImageUrl(propsMsg);
        //   if (emojiUrl) {
        //     return emojiUrl;
        //   }
        //   return propsMsg.emotionUrl; // todo 暂时不明白这个业务场景
        return propsMsg.emotionUrl;
    }, [propsMsg]);
    // const imgStyle = useMemo(() => {
    //     const { width, height } = propsMsg;
    //     const maxWidth = 400;
    //     const maxHeight = 380;
    //     const updatedSize = {
    //       width,
    //       height,
    //     };
    //     if (width / height >= maxWidth / maxHeight) {
    //       if (width > maxWidth) {
    //         updatedSize.width = maxWidth;
    //         updatedSize.height = maxWidth * height / width;
    //       }
    //     } else if (height > maxHeight) {
    //       updatedSize.height = maxHeight;
    //       updatedSize.width = maxHeight * width / height;
    //     }

    //     updatedSize.width = `${updatedSize.width}px`;
    //     updatedSize.height = `${updatedSize.height}px`;
    //     updatedSize.maxWidth = `${maxWidth}px`;
    //     updatedSize.maxHeight = `${maxHeight}px`;
    //     return updatedSize;
    // },[propsMsg])
    return (
        <div className={`${PrefixCls}-dynamic-emotion`}>
            <img src={emoticonUrl} alt="" className={`${PrefixCls}-imgmsg-img`} />
        </div>
    );
};
