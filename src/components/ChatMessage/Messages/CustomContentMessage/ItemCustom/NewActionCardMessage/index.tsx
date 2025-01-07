import React, { useMemo, useState } from 'react';
import './index.scss';
import { PrefixCls } from '../../../../constants';
import Toast from '../../../../Components/Toast';
import i18n from '../../../../utils/i18n/I18nUtil';
import { copyTxt } from '../../../../utils/tools/common';
import Icon from '../../../../Components/Icon'
export default (props: {
    newActionList: any,
    language?: string,
    showCite?: boolean
}) => {
    const {
        newActionList: tempNewActionList,
        language: propsLan
    } = props;

    let propsNewActionList = { ...tempNewActionList };
    const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
    const [formValue, setFormValue] = useState<any>({});
    const [formErrorKeyMap, setFormErrorKeyMap] = useState<any>({});
    // 测试数据部分
    propsNewActionList.actionList = propsNewActionList.actionList.map((item: any,) => {
        return {
            ...item,

        };
    });
    // propsNewActionList = {
    //     ...propsNewActionList,
    //     appIcon: 'https://dimg04.c-ctrip.com/images/1gs2b120008xr5q9g2C1F_R_60_60.png',
    //     appName: '应用详情应用详情应用详情应用详情应用详情应用详情应用详情应用详情应用详情应用详情',
    //     form: [
    //         {
    //             type: 0,
    //             key: 'pendRemark',
    //             label: '审批意见(拒绝时必填)',
    //             required: true,
    //             limitLength: 200,
    //             placeholder: '审批意见',
    //         },
    //     ],
    //     actionLevel: 0,
    //     actionList: [
    //         {
    //             location: 1,
    //             openUrl: 'http://iquality.ctripcorp.com/feedback/submit?mid=9&pid=9',
    //             text: '告警详情',
    //             textStyle: 0,
    //             type: 1,
    //             requiredForms: ['pendRemark'],
    //         }, {
    //             location: 1,
    //             openUrl: 'http://iquality.ctripcorp.com/feedback/submit?mid=9&pid=9',
    //             text: '告警详情',
    //             textStyle: 0,
    //             type: 2,
    //         }, {
    //             location: 1,
    //             openUrl: 'http://iquality.ctripcorp.com/feedback/submit?mid=9&pid=9',
    //             text: '告警详情',
    //             textStyle: 0,
    //             type: 2,
    //         },
    //     ],
    // };
    // 测试数据结束
    const getContentHightLight = (contentValue: string, hightLightValue: string, hightLightColor: string) => {
        const replaceHtml = (contentValue || '').replaceAll(hightLightValue,
            `<span style="fontWeight:bold;color:${hightLightColor}">${hightLightValue}</span>`);
        return replaceHtml;
    };
    const getTrueLength = (str: string) => {
        // 获取字符串的真实长度（字节长度）
        const len = str.length;
        let truelen = 0;
        for (let x = 0; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
                truelen += 2;
            } else {
                truelen += 1;
            }
        }
        return truelen;
    };
    const topActionButtonList = useMemo(() => {
        const {
            actionList: tempActions,
        } = propsNewActionList;
        const staticAction = (tempActions || []).filter((actionInfo: any) => {
            return actionInfo.location === 2; // 当前定位在右上角位置的更多操作
        });
        // 目前的数据结构暂时无法查询到
        //   const remoteAction = this.remoteMoreActionList;
        //   if (this.moreActionType) {
        //     return remoteAction;
        //   }
        return staticAction;
    }, [propsNewActionList]);
    const appIcon = useMemo(() => {
        const {
            appIcon: AppIcon,
        } = propsNewActionList;
        return AppIcon;
    }, [propsNewActionList]);
    const appName = useMemo(() => {
        const {
            appName: AppName,
        } = propsNewActionList;
        return AppName;
    }, [propsNewActionList]);
    const hasBubbleTop = useMemo(() => {
        return appName || appIcon;
    }, [appName, appIcon]);
    const title = useMemo(() => {
        const {
            title: Title,
        } = propsNewActionList;
        return Title;
    }, [propsNewActionList]);

    const subTitle = useMemo(() => {
        const {
            subtitle: Subtitle,
        } = propsNewActionList;
        return Subtitle;
    }, [propsNewActionList]);
    const subTitleColor = useMemo(() => {
        const {
            subtitleColor: SubtitleColor,
        } = propsNewActionList;
        return SubtitleColor;
    }, [propsNewActionList]);
    const contentType = useMemo(() => {
        const {
            infoAlignType: InfoAlignType,
        } = propsNewActionList;
        return InfoAlignType !== 1 ? 'not-alight' : 'alight';
    }, [propsNewActionList]);

    const contentList = useMemo(() => {
        const {
            infoList: InfoList,
            infoHlColor: InfoHlColor,
        } = propsNewActionList;
        if (InfoList.length) {
            return InfoList.map((info: any) => {
                return {
                    title: info.title,
                    contentDetail: getContentHightLight(
                        info.content,
                        info.highlight,
                        InfoHlColor || '#000',
                    ),
                    content: info.content,
                    action: info.action,
                };
            });
        } else {
            return [];
        }
    }, [propsNewActionList]);

    const formList = useMemo(() => {
        const {
            form: tempFormList,
        } = propsNewActionList;
        return tempFormList;
    }, [propsNewActionList]);

    const actionList = useMemo(() => {
        const {
            actionList: tempActionList,
        } = propsNewActionList;
        return tempActionList;
    }, [propsNewActionList]);
    // 底部操作按钮的数组
    const bottomActionButtonList = useMemo(() => {
        return (actionList || []).filter((actionInfo: any) => {
            return actionInfo.location === 1 || !actionInfo.location; // 显示位置在底部的按钮
        });
    }, [actionList]);
    // 按钮的显示类型
    // 1：强操作 按钮展示样式为实体蓝色；注：仅当actionlist里有一个操作时生效 ；
    // 2:action里的btn全部竖排 根据textStyle显示样式。默认黑色字体 左对齐 右侧 带箭头；
    // 若为0或此字段缺失：按照视觉按钮一排最多平铺三个，总的字符串不超过12个汉字即24个字符，若超过则变为竖排方式排列；
    const actionLevel = useMemo(() => {
        const {
            actionLevel: tempActionLevel,
        } = propsNewActionList;
        return tempActionLevel;
    }, [propsNewActionList]);
    const strongAction = useMemo(() => {
        return actionLevel === 1 && bottomActionButtonList.length === 1;
    }, [actionLevel, bottomActionButtonList]);

    const actionColumnList = useMemo(() => {
        const levelColumn = actionLevel === 2;
        const contentLengthColumn = getTrueLength(
            bottomActionButtonList.map((b: any) => b.text || '').join(''),
        ) > 24;
        return levelColumn || contentLengthColumn;
    }, [actionLevel, bottomActionButtonList]);
    // 方法部分
    const clickCopy = (txt: string) => {
        setShowSuccessToast(true);
        copyTxt(txt);
    };
    const onKeyUpFunc = (e: any, formInfo: any) => {
        const target = e.target;
        const rows = target.value.split('\n');
        // 输入的时候，取消掉当前的状态
        setFormErrorKeyMap((origin: any) => {
            origin[formInfo.key] = false;
            return {
                ...origin,
            };
        });
        setFormValue((origin: any) => {
            origin[formInfo.key] = target.value;
            return {
                ...origin,
            };
        });
        target.setAttribute('rows', Math.min(rows.length || 1, 3));
    };
    const getIsActionForwardType = (button: any) => {
        return actionColumnList && button.textStyle === 0;
    };
    const getIsColorColumnType = (button: any) => {
        return actionColumnList && button.textStyle === 1;
    };
    const getBottomStyle = (buttonInfo: any) => {
        const { textStyle } = buttonInfo || {};
        let style = {};
        if (textStyle === 1) {
            style = {
                ...style,
                'fontWeight': '500',
            };
        }
        return style;
    };
    const actionClick = (buttonInfo: any) => {
        const { type } = buttonInfo;
        if (+type === 1) {
            // 1：请求服务；
            // serverUrl     可选 （type是1时必选）字符串 请求的服务地址；注服务契约规范需要@俞杨补充
            // param         可选 （type是1时必选）字符串 请求时的参数
            // 校验必填字段
            const { requiredForms, serverUrl, param } = buttonInfo;
            const { formData, isPass } = (requiredForms || []).reduce(
                (result: any, formKey: number) => {
                    if (!result.formData) {
                        result.formData = {};
                    }
                    if (formValue[formKey]) {
                        result.formData[formKey] = formValue[formKey];
                    } else if (result.isPass === true) {
                        result.isPass = false;
                        setFormErrorKeyMap((origin: any) => {
                            origin[formKey] = true;
                            return {
                                ...origin,
                            };
                        });
                    } else {
                        setFormErrorKeyMap((origin: any) => {
                            origin[formKey] = true;
                            return {
                                ...origin,
                            };
                        });
                    }
                    return result;
                },
                {
                    formData: void 0,
                    isPass: true,
                },
            );
            if (!isPass) {
                return;
            }
            const reqBody = {
                traceId: propsNewActionList.traceId,
                actionType: propsNewActionList.actionType,
                param,
                formData,
            };
            console.log('请求参数：', reqBody, '请求URL：', serverUrl);
        } else if (+type === 2) {
            // 2:跳转；
            // openUrl       可选（type是2时必选） 字符串 连接url type为open时有效 pc端跳转 使用
            // schamaUrl     可选 字符串 转跳url type为open时有效 手机端跳转优先使用，若无则使用openurl
            const { openUrl, schamaUrl } = buttonInfo;
            window.open(schamaUrl || openUrl);
        } else if (+type === 3) {
            // msgTitle      可选 （type是3时必选）字符串 消息内容
            // qid           可选  字符串 ai那边的问题id
            const { msgTitle } = buttonInfo;
            console.log('发消息给ai(接了IM+的服务号专用)', msgTitle);
            //   this.$store.dispatch('sendAITextMessage', { text: msgTitle });
        } else if (+type === 4) {
            // 4:弹窗提示
            // alertContent  可选 （type是4时必选）字符串 提示内容
            // alertType     可选 （type是4时必选）int  提示控件类型 1:toast;2:alert
            const { alertContent, alertType } = buttonInfo;
            if (+alertType === 1) {
                console.log('toast弹窗 ==== >', alertContent);
            } else if (+alertType === 2) {
                console.log('alert弹窗 ==== >', alertContent);
            }
        }
        try {
            // 埋点信息
            // traceOfficialAction(this.message, buttonInfo, index);
            // console.log(propsNewActionList, buttonInfo, index)
        } catch (e) {
            console.log('Error in traceOfficialAction', e);
        }
    };
    let showEn = false;

    return (
        <div className={`${PrefixCls}-new-action-card ${showEn ? 'new-action-cardEn' : ''}`} >
            {/* 顶部信息 */}
            {/* 更多操作 */}
            {
                topActionButtonList.length ? (
                    <div className={`
                        ${PrefixCls}-action-point
                        ${!hasBubbleTop ? 'action-point-title' : ''}
                    `}>
                        <Icon type="more" className='iconfont_more' />
                    </div>
                ) : null
            }
            {/* app信息 */}
            {
                hasBubbleTop && (
                    <div className={`
                        ${PrefixCls}-top-box
                        ${topActionButtonList.length ? 'top-box-shorten' : ''}
                        `}
                    >
                        {
                            appIcon && (
                                <div className="top-icon" v-if="appIcon">
                                    <img src={appIcon} alt="" />
                                </div>
                            )
                        }
                        {
                            appName && (
                                <div className="top-name">
                                    <span className="ellipsis">{appName}</span>
                                </div>
                            )
                        }
                    </div>
                )
            }
            {/* 一级标题 */}
            <div className={`${PrefixCls}-main-title ${!hasBubbleTop && topActionButtonList.length ? 'shorten' : ''}`}>
                {title}
            </div>

            {/* 二级标题 */}
            {
                subTitle && <div
                    className={`${PrefixCls}-sub-title`}
                    style={{ color: subTitleColor }}
                >
                    {subTitle}
                </div>
            }
            {/* 正文部分 */}
            {
                <div className={`${PrefixCls}-card-content`} >
                    {
                        contentList.length ? (contentList.map((contentInfo: any, index: number) => {
                            return <div className={`${PrefixCls}-content-wrapper ${contentType !== 'not-alight'
                                ? 'align-content-wrapper' : ''}`}
                                key={index}>
                                <span className="content-sub-title"> {contentInfo.title}：</span>
                                <span
                                    className="content-sub-content"
                                    dangerouslySetInnerHTML={{ __html: contentInfo.contentDetail }}
                                ></span>
                                {
                                    contentInfo.action === 'copy' && (
                                        <Icon type="copy" className='iconfont_copy' color="#1466DE"
                                            onClick={() => { clickCopy(contentInfo.content); }} />
                                    )
                                }
                            </div>;
                        })) : null
                    }

                    {/* 表单填写 */}
                    {
                        formList.length ? (
                            <div className={`${PrefixCls}-form-list-box`}>
                                {
                                    formList.map((formInfo: any) => {
                                        return <div className="form-item" key={formInfo.key}>
                                            <div
                                                className={`form-label ${formErrorKeyMap[formInfo.key]
                                                    ? 'error' : ''}`}
                                            >
                                                {formInfo.label}
                                            </div>
                                            <div className="form-input">
                                                <textarea
                                                    value={formValue[formInfo.key]}
                                                    rows={1}
                                                    onKeyUp={(e) => { onKeyUpFunc(e, formInfo); }}
                                                    onChange={(e) => {
                                                        let targetValue = e.target.value;
                                                        setFormValue((origin: any) => {
                                                            origin[formInfo.key] = targetValue;
                                                            return {
                                                                ...origin,
                                                            };
                                                        });
                                                    }}
                                                    maxLength={formInfo.limitLength}
                                                    placeholder={formInfo.placeholder}
                                                ></textarea>
                                            </div>
                                        </div>;
                                    })
                                }
                            </div>
                        ) : null
                    }
                </div>
            }
            {/* 操作按钮部分 */}
            {/* {
                // 需要判断当前操作的行为是否失效
                !isDisableAction && (\) : null */}
            <div className={`${PrefixCls}-action-group ${strongAction
                ? 'strong' : ''} ${!actionColumnList ? 'flex_row' :
                    'flex_column'}
                    `}>
                {
                    bottomActionButtonList.map((buttoninfo: any, buttonIndex: number) => {
                        return <div className={`action-button ${getIsActionForwardType(buttoninfo) ?
                            'forward_action' : ''} ${getIsColorColumnType(buttoninfo) ? 'color_center_action' : ''}
                                    `}
                            style={getBottomStyle(buttoninfo)}
                            key={`bottom-action-${buttonIndex}`}
                            onClick={() => { actionClick(buttoninfo); }}>
                            {buttoninfo.text}
                            {
                                getIsActionForwardType(buttoninfo) && (
                                    <Icon type="forward" className='iconfont_forward' />
                                )
                            }
                        </div>;
                    })
                }
            </div>
            {/* } */}
            {/* 复制成功的弹窗 */}
            {
                showSuccessToast && <Toast
                    show={showSuccessToast}
                    close={() => { setShowSuccessToast(false); }}
                    content={i18n(propsLan, 'copySuccess')} />
            }
        </div >
    );
};
