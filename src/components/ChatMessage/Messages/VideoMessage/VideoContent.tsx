import React, { useEffect, useState, useMemo } from 'react';
import { PrefixCls } from '../../constants';
import prettyBytes from '../../utils/tools/prettyBytes';
import Icon from '../../Components/Icon'
import './index.scss';
const videoBg = 'https://pages.c-ctrip.com/trippal/trippal-message-assets/common/video-backgroud.png';
interface VideoMessageProps {
    messageBody: string;
}
interface MessageProps {
    message: VideoMessageProps;
}
export default (props: MessageProps) => {
    const {
        message: propsMsg,
    } = props;
    const [videoProps, setVideoProps] = useState({
        size: {
            width: 'auto',
            height: 'auto',
        },
        converError: false,
    });
    const [coverUrl, setCoverUrl] = useState<string>("");
    const msgContent = useMemo(() => {
        const {
            messageBody,
        } = propsMsg;
        return messageBody ? JSON.parse(messageBody) : null;
    }, [propsMsg]);
    const formatSize = (width: number, height: number) => {
        let size = {
            width: 'auto',
            height: 'auto',
        };
        if (height > width) {
            size.width = `${Math.max(width * 200 / height, 120)}px`;
            size.height = '200px';
        } else {
            size.width = '200px';
            size.height = `${Math.max(height * 200 / width, 120)}px`;
        }
        return size;
    };
    const getImageWH = async (src: string, callback: any) => {
        let image = new Image(); // 初始化这个图片
        image.src = src; // 图片的url
        image.onload = await function () {
            let imageProps = {
                width: image.width,
                height: image.height,
            };
            callback(imageProps);
        };
    };

    useEffect(() => {
        if (msgContent) {
            const { video: { width, height, cover, url } } = msgContent;
            if (cover && url) {
                let imgSrc;
                if ((cover.startsWith('http://') || cover.startsWith('https://'))) {
                    imgSrc = cover;
                }
                const arr = url.split('/');
                const urlPrefix = arr.splice(0, arr.length - 1).join('/');
                imgSrc = `${urlPrefix}/${cover}`;
                setCoverUrl(imgSrc);
                if (width && height) {
                    setVideoProps({
                        size: formatSize(width, height),
                        converError: false,
                    });
                } else {
                    const callBack = (imgProps: any) => {
                        setVideoProps({
                            size: formatSize(imgProps.width, imgProps.height),
                            converError: false,
                        });
                    };
                    getImageWH(imgSrc, callBack);
                }
            } else {
                // 未加载到视频的时候
                setVideoProps({
                    size: {
                        width: 'auto',
                        height: 'auto',
                    },
                    converError: true,
                });
            }
        } else {
            setVideoProps({
                size: {
                    width: 'auto',
                    height: 'auto',
                },
                converError: true,
            });
        }
    }, [msgContent]);
    const normalizeSize = useMemo(() => {
        if (msgContent) {
            const {
                video: {
                    size,
                },
            } = msgContent;
            return prettyBytes(size);
        } else {
            return null;
        }
    }, [msgContent]);
    const normalizeDuration = useMemo(() => {
        function pad(num: number) {
            return (`0${num}`).slice(-2);
        }
        if (msgContent) {
            let secs = Math.floor(msgContent.video.duration);
            const minutes = Math.floor(secs / 60);
            secs %= 60;
            return `${pad(minutes)}:${pad(secs)}`;
        } else {
            return null;
        }
    }, [msgContent]);
    const openVideo = () => {
        if (videoProps.converError) {
            return;
        }
        if (msgContent) {
            const {
                video: {
                    url,
                },
            } = msgContent;
            if (url) {
                window.open(url, '_blank');
            }
        }
    };

    return (
        <>
            <div className={`${PrefixCls}-message-video-content `} style={videoProps.size} onClick={openVideo} >
                {
                    videoProps.converError ? <img src={videoBg} alt="" /> : <>
                        <img style={videoProps.size} src={coverUrl} />
                        <div className="top-view">
                            {/* playbtn */}
                            <Icon type="play" className='top-view-playicon' />
                            <div className="bottom-bar">
                                <span>{normalizeSize}</span>
                                <span>{normalizeDuration}</span>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    );
};
