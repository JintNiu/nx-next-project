// 图文混排
import React, { useCallback, useEffect, useState, useRef } from 'react';
import './index.scss';
import { PrefixCls } from '../../../../constants';
import { renderTextEmoji, linkifyString, renderEmoji } from '../../../../utils/tools/DataTools';
import i18n from '../../../../utils/i18n/I18nUtil';
import DefaultMessage from '../../../DefaultMessage';
import Icon from '../../../../Components/Icon';
interface MessageItem {
    type: number;
    children: [];
    tag: string;
}
export default (props: {
    msgList: MessageItem[],
    showCite?: boolean,
    onClick?: any;
    language?: string;
}) => {
    const {
        msgList: propsMsgList,
        showCite: propsShowCite = false,
        onClick: propsClick,
        language: propsLan
    } = props;
    const [showAll, setShowAll] = useState(true);
    const [showMoreBtn, setShowMoreBtn] = useState<boolean>(false); // 是否显示更多标签
    const [renderMsgList, setRenderMsgList] = useState<Array<MessageItem>>([]);
    const [hasImgCount, setHasImgCount] = useState(0);
    const [loadImgCount, setLoadImgCount] = useState(0);
    const [bottomPlaceHolder, setBottomPlaceHolder] = useState<any>(null);
    const loadImgCur = useRef(0);
    useEffect(() => {
        if (propsMsgList.length) {
            setRenderMsgList(propsMsgList);
            // 数据中图片资源的数量
            const [{ children: msgChildren }] = propsMsgList;
            let tempImgCount = msgChildren.filter((msgChild: any) => {
                const {
                    type: msgChildType,
                    tag: msgChildTag,
                } = msgChild;
                return msgChildType === 1 && msgChildTag.toLowerCase() === 'img';
            }).length || 0;
            setHasImgCount(tempImgCount);
        } else {
            setRenderMsgList([]);
        }
    }, [propsMsgList]);
    const RenderTextContentSpan = useCallback((spanProps: {
        msg: any,
    }) => {
        const {
            msg: {
                tag,
                text,
                children,
            },
        } = spanProps;
        if (tag && tag.toLowerCase() === 'at') {
            return children.length > 0 ? (
                children.map((itemAt: any, itemAtIdx: number) => {
                    return <span className={`${PrefixCls}-is-at`} key={itemAtIdx}>{itemAt.text}</span>;
                })
            ) : null;
        } else {
            return renderTextEmoji(
                renderEmoji(linkifyString(text)),
            ).replace(/\n/g, '<br/>');
        }
    }, [propsMsgList]);
    // 监听当前底部位置的距离高度
    useEffect(() => {
        if (loadImgCur.current > 0) {
            if (loadImgCur.current === hasImgCount && bottomPlaceHolder) {
                if (bottomPlaceHolder.offsetTop > 500) {
                    setShowMoreBtn(true);
                } else {
                    setShowMoreBtn(false);
                }

            }
        }
        return () => {
            setLoadImgCount(0);
        };
    }, [loadImgCount]);
    // 监听图片资源的加载
    const loadImgFunc = () => {
        loadImgCur.current = loadImgCur.current + 1;
        setLoadImgCount(loadImgCur.current);
    };
    const openPreviewImg = (src: string) => {
        // if (propsClick) {
        if (propsClick) {
            propsClick(src, 'link');
        }
        // } else {
        window.open(src, '_blank');
        // }
    };
    return (
        <div className={`${PrefixCls}-item-rich-text-wrapper ${!showAll ? 'expand-all' : ''} `}>
            {

                renderMsgList.length > 0 ? (
                    <>
                        {
                            renderMsgList.map((item, index) => {
                                return <div key={index} >
                                    {
                                        item.children.length > 0 ? (
                                            item.children.map((dep: any, depIdx) => {
                                                const {
                                                    type,
                                                    tag,
                                                    attrs: curImg,
                                                } = dep;
                                                if (type === 1 && tag.toLowerCase() === 'img') {
                                                    // 图片
                                                    return curImg ? (
                                                        !propsShowCite ? (
                                                            <div className={`${PrefixCls}-img-line
                                                            ${curImg.width > curImg.height ? 'width-image' : 'height-image'}`}
                                                                key={depIdx}>
                                                                <img
                                                                    src={curImg.src}
                                                                    alt=""
                                                                    className="image"
                                                                    onClick={() => { openPreviewImg(curImg.src); }}
                                                                    onLoad={loadImgFunc} />
                                                            </div>
                                                        ) : <DefaultMessage
                                                            showCite={propsShowCite}
                                                            showContent={i18n(propsLan, 'image')} />
                                                    ) : null;
                                                } else {
                                                    return <span key={depIdx}>
                                                        <RenderTextContentSpan msg={dep} />
                                                    </span>;
                                                }
                                            })
                                        ) : null
                                    }
                                </div>;
                            })
                        }
                        {!propsShowCite && <span ref={setBottomPlaceHolder}></span>}
                    </>
                ) : null
            }

            {/* 展开收起的bar */}
            {
                showMoreBtn ? (
                    <div className={`${PrefixCls}-show-more-bar`}>
                        <div className={`${PrefixCls}-show-more-bar-btn`} onClick={() => { setShowAll(!showAll); }}>
                            {
                                showAll ? `${i18n(propsLan, 'richTextShowAll')}` : `${i18n(propsLan, 'richTextNoShowAll')}`
                            }
                            <Icon size="18px" type={showAll ? 'down' : 'up'} className="icon_expand" />
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};
