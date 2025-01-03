import { CloseCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { Divider, message, Result, Tooltip } from 'antd';
import React, { useEffect, useState, useMemo, memo } from 'react';
// import { getComponentInfoFormSnapshot } from '../../../common/commonUtils/component';
import { TYPE } from '../constant';

import './index.scss';
import { useSelector } from 'react-redux';
import { selectorFlow, setActiveNodeId, setCenterNodeId } from '@/store/modules/flowSlice';
import { useMyDispatch } from '@/store';
import { getI18n } from '@/utils/i18n';

const SHARK = {
    errorMsg: getI18n('page_error_msg', 'Error Message'),
    noErrorInConfig: getI18n('page_flow_no_error_tip', 'There are no errors in the process configuration'),
    processError: getI18n('page_some_process_error', '${total} process error'),
    nodeError: getI18n('page_some_node_error', '${total} node error'),
    inputOutputConfigError: getI18n('page_input_output_config_error', 'Input/Output Config Error'),
}

// {
//     "processErrorList": [
//         "流程中最后一个节点必须是终止"
//     ],
//     "nodeErrorList": [
//         {
//             "id": "approval_1",
//             "name": "",
//             "icon": "https://sf3-cn.feishucdn.com/obj/anycross/anycross-icon/7729fb91-a699-40e5-847b-cdd44c452e22/image.png",
//             "list": [
//                 "组件配置不存在"
//             ]
//         },
//     ],
//     "jsonPathErrorMap": {
//         "$.body.SendCode": [
//             "缺少选项配置111",
//             "缺少选项配置222"
//         ],
//     }
// }

const formatErrorList = (errorMap = {}, steps, triggerMap = {}, componentMap = {}) => {
    // console.log('formatErrorList', errorMap, steps, triggerMap, componentMap)
    let processErrorList = [], nodeErrorList = [], jsonPathErrorMap = null;
    let key;
    for (key in errorMap) {
        if (key === 'process') {
            processErrorList = errorMap[key];
        } else if (key === 'jsonPath') {
            jsonPathErrorMap = !isEm(errorMap[key]) ? errorMap[key] : null;
        } else {
            const { name = '', type = '', componentId } = steps[key] || {};
            let icon = '';
            const code = key.split('.')[0].replace(/_\d+$/, '');
            if (type.toLocaleLowerCase() === TYPE.TRIGGER) {
                icon = (triggerMap[code] || {}).iconUrl;
            } else {
                icon = (componentMap[code] || {}).iconUrl;
                // const obj = getComponentInfoFormSnapshot(code, componentId, componentMap) || {}
                // icon = obj.iconUrl;
            }
            nodeErrorList.push({
                id: key,
                name: name,
                icon: icon,
                list: errorMap[key]
            })
        }
    }
    return { processErrorList, nodeErrorList, jsonPathErrorMap }
}

const ErrorContent = ({
    // titleIcon = null,
    onlyShowList,
    title = '',
    tip = '',
    list = [],
    map,
    onSelectError = () => { }
}) => {
    return <div className='flow-error-content-item'>
        <div className='flow-error-title'>
            <span className='error-title-icon'>
                <CloseCircleTwoTone twoToneColor="#ff4d4f" />
            </span>
            {title}
            {tip && <Tooltip title={tip}>
                <InfoCircleOutlined style={{ marginLeft: "6px" }} />
            </Tooltip>}
        </div>
        <div className='flow-error-list'>
            {
                list.map(item => {
                    if (onlyShowList) {
                        return <div className='flow-error-item' key={item}>
                            {item}
                        </div>
                    }
                    return <div className='flow-error-item selectable' key={item.id} onClick={() => { onSelectError(item.id) }}>
                        {item.icon && <img src={item.icon} />}
                        <div className='error-list'>
                            <span className='error-text'>
                                {item.name ? `[${item.name}]  ` : ''}
                                {item.id ? `(${item.id})  ` : ''}
                                {item.list ? item.list.join("; ") : ''}
                            </span>
                        </div>
                    </div>
                })
            }
            {
                !map ? null
                    : Object.keys(map).map(key => {
                        const item = map[key];
                        return <div className='flow-error-item' key={key}>
                            <div className='error-list'>
                                <span className='error-text'>
                                    {`${key}  `}
                                    <ul className='error-ul'>
                                        {
                                            item.map((tip, i) => {
                                                return <li key={tip + i} className="error-tip">
                                                    {tip}
                                                </li>
                                            })
                                        }
                                    </ul>
                                </span>
                            </div>
                        </div>
                    })
            }
        </div>
    </div>
}

const ErrorToolCard = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const {
        steps,
        componentMap,
        triggerMap,
        flowError,
    } = useSelector(selectorFlow);
    const dispatch = useMyDispatch();

    const [errorMap, setErrorMap] = useState({
        processErrorList: [],
        nodeErrorList: [],
        jsonPathErrorMap: null
    })

    useEffect(() => {
        if (flowError.errMsg) {
            return;
        }
        const errorMap = formatErrorList(flowError.errorMap, steps, triggerMap, componentMap)
        console.log("==ErrorToolCard===", flowError, errorMap,)
        setErrorMap(errorMap)
    }, [flowError])

    const handleSelectErrorItem = (id) => {
        dispatch(setActiveNodeId(id))
        dispatch(setCenterNodeId(id))
    }

    return (<div className='flow-error-wrapper'>
        {contextHolder}
        <div className='flow-error-header'>
            {SHARK.errorMsg}
        </div>
        {
            !errorMap.processErrorList.length && !errorMap.nodeErrorList.length && !errorMap.jsonPathErrorMap
                ? <Result
                    // icon={<SmileOutlined />}
                    status={flowError.errMsg ? 'error' : "success"}
                    title={flowError.errMsg || SHARK.noErrorInConfig}
                />
                : <div className='flow-error-content customize-scrollbar'>
                    {/* process */}
                    {
                        errorMap.processErrorList.length > 0 &&
                        <ErrorContent
                            title={SHARK.processError.replace('${total}', errorMap.processErrorList.length)}
                            // titleIcon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                            // tip="-==="
                            onlyShowList
                            list={errorMap.processErrorList}
                            onSelectError={handleSelectErrorItem}
                        />
                    }

                    {/* config */}
                    {
                        errorMap.jsonPathErrorMap &&
                        <ErrorContent
                            title={SHARK.inputOutputConfigError}
                            map={errorMap.jsonPathErrorMap}
                        />
                    }

                    {/* node */}
                    {
                        errorMap.nodeErrorList.length > 0 && <ErrorContent
                            title={SHARK.nodeError.replace('${total}', errorMap.nodeErrorList.length)}
                            // titleIcon={<WarningTwoTone twoToneColor="#ff4d4f" />}//faad14
                            // tip="-==="
                            list={errorMap.nodeErrorList}
                            onSelectError={handleSelectErrorItem}
                        />
                    }
                </div>
        }
    </div>)
}

export default memo(ErrorToolCard)