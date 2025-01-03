import React, { useEffect, useMemo, useReducer } from 'react';
import { Tooltip, Divider, Card, Badge } from 'antd';
import { BuildOutlined, ProjectOutlined, WarningOutlined, ProfileOutlined, SearchOutlined, DatabaseOutlined, CloseOutlined } from '@ant-design/icons';
import Connector from '../Connector';
import './index.scss';
import SearchNode from '../SearchNode';
import ConfigToolCard from '../ConfigToolCard';
// import Log from '../Log';
import ErrorToolCard from '../ErrorToolCard';
import { useSelector } from 'react-redux';
import { selectorFlow } from '@/store/modules/flowSlice';
import { getI18n } from '@/utils/i18n';

const SHARK = {
    componentsConnector: getI18n('page_components_connector', 'Components and Connectors'),
    errorMsg: getI18n('page_error_msg', 'Error Message'),
    projectConfig: getI18n('page_project_config', 'Project Configuration'),
    searchNode: getI18n('page_search_node', 'Search Node'),
}

export default ({ editing }) => {
    const { flowError } = useSelector(selectorFlow);
    const [active, setActive] = useReducer((state, action) => {
        if (state === action) {
            return null;
        } else {
            return action
        }
    }, null);

    useEffect(() => {
        if (!editing) {
            if (active === 'connector' || active === 'error') {
                setActive(null);
            }
        }
    }, [editing, active])

    useEffect(() => {
        if (active === 'log') {
            // 日志跳转到外部系统
            // window.open("");
        }
    }, [active])

    // useEffect(() => {
    //     setActive(null)
    // }, [visit])

    const hasError = useMemo(() => {
        if (flowError) {
            return !!flowError.errMsg || !!Object.keys(flowError.errorMap).length;
        }
        return false;
    }, [flowError])

    return (
        <>
            <div className="flow-toolbox">
                {
                    editing && (
                        <>
                            <div className="flow-toolbox-btn">
                                {
                                    active === 'connector' ? (
                                        <div className="flow-toolbox-close"><CloseOutlined onClick={() => { setActive('connector'); }} /></div>
                                    ) : (
                                        <Tooltip title={SHARK.componentsConnector} placement="right">
                                            <div className="flow-toolbox-icon"><BuildOutlined onClick={() => { setActive('connector'); }} /></div>
                                        </Tooltip>
                                    )
                                }
                            </div>
                            <Divider />
                        </>
                    )
                }
                {/* <div className="flow-toolbox-btn">
                    {
                        active === 'log' ? (
                            <div className="flow-toolbox-close"><CloseOutlined onClick={() => { setActive('log'); }} /></div>
                        ) : (
                            <Tooltip title="Log" placement="right">
                                <div className="flow-toolbox-icon"><ProjectOutlined onClick={() => { setActive('log'); }} /></div>
                            </Tooltip>
                        )
                    }
                </div>
                <Divider />*/}
                {
                    editing && (
                        <>
                            <div className="flow-toolbox-btn">
                                <Badge dot={hasError}>
                                    {
                                        active === 'error' ? (
                                            <div className="flow-toolbox-close"><CloseOutlined onClick={() => { setActive('error'); }} /></div>
                                        ) : (
                                            <Tooltip title={SHARK.errorMsg} placement="right">
                                                <div className="flow-toolbox-icon"><WarningOutlined onClick={() => { setActive('error'); }} /></div>
                                            </Tooltip>
                                        )
                                    }
                                </Badge>
                            </div>
                            <Divider />
                        </>
                    )
                }
                {/* <div className="flow-toolbox-btn">
                    {
                        active === 'config' ? (
                            <div className="flow-toolbox-close"><CloseOutlined onClick={() => { setActive('config'); }} /></div>
                        ) : (
                            <Tooltip title={SHARK.projectConfig} placement="right">
                                <div className="flow-toolbox-icon"><ProfileOutlined onClick={() => { setActive('config'); }} /></div>
                            </Tooltip>
                        )
                    }
                </div> */}
                {/* <Divider /> */}
                {/* <div className="flow-toolbox-btn">
                    {
                        active === 'data' ? (
                            <div className="flow-toolbox-close"><CloseOutlined onClick={() => { setActive('data'); }} /></div>
                        ) : (
                            <Tooltip title="Data Storage" placement="right">
                                <div className="flow-toolbox-icon"><DatabaseOutlined onClick={() => { setActive('data'); }} /></div>
                            </Tooltip>
                        )
                    }
                </div>
                <Divider /> */}
                <div className="flow-toolbox-btn">
                    {
                        active === 'search' ? (
                            <div className="flow-toolbox-close"><CloseOutlined onClick={() => { setActive('search'); }} /></div>
                        ) : (
                            <Tooltip title={SHARK.searchNode} placement="right">
                                <div className="flow-toolbox-icon"><SearchOutlined onClick={() => { setActive('search'); }} /></div>
                            </Tooltip>
                        )
                    }
                </div>
            </div>

            {
                active && (
                    <Card bordered={false} className="flow-toolbox-content">
                        {active === 'connector' && (<Connector mode="drag" />)}
                        {/* {active === 'config' && (<ConfigToolCard mode="drag" />)} */}
                        {active === 'search' && (<SearchNode />)}
                        {/* {active === 'log' && (<Log />)} */}
                        {active === 'error' && (<ErrorToolCard />)}
                    </Card>
                )
            }


        </>
    )
}