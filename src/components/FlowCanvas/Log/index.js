import { DownOutlined, RedoOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Dropdown, message, Table, } from 'antd';
import React, { useEffect, useState, useMemo, memo } from 'react';

import './index.scss';

const fetchMockLogData = () => {
    return new Promise((resolve) => {
        resolve({
            total: 22,
            data: Array.from({ length: 22 }).map((_, index) => {
                return {
                    id: index,
                    generateTime: `2023-01-01 22:22:${index}`,
                    state: index % 2 == 0 ? `success` : 'error',
                    error: 2,
                    runningTime: "66",
                }
            })
        })
    })
}


const PAGESIZE = 10;

const LOG_TYPE = {
    DEBUG: "DEBUG",
    RUNNING: "RUNNING"
}

const LOG_TYPE_LABEL = {
    [LOG_TYPE.DEBUG]: "Debug",
    [LOG_TYPE.RUNNING]: "Running",
}

const Log = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const [logType, setLogType] = useState(LOG_TYPE.DEBUG);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    const columns = [
        {
            title: 'Generate Time',
            dataIndex: 'generateTime',
            key: 'generateTime',
            ellipsis: true,
        },
        {
            title: 'Running State',
            dataIndex: 'state',
            key: 'state',
            ellipsis: true,
            render: (value, record) => {
                return <>
                    <Badge status={value} style={{ marginRight: "4px" }} />
                    {value}
                </>
            }
        },
        {
            title: 'Error',
            dataIndex: 'error',
            key: 'error',
            ellipsis: true,
        },
        {
            title: 'Running Time',
            dataIndex: 'runningTime',
            key: 'runningTime',
            ellipsis: true,
            render: (value) => {
                return `${value} ms`
            }
        },
        {
            title: 'Operation',
            key: 'operation',
            ellipsis: true,
            render: (value, record) => {
                return <Button type='link' onClick={() => { gotoErrorDetail(record) }}>Detail</Button>
            }
        },
    ]

    useEffect(() => {
        queryData();
    }, []);

    useEffect(() => {
        queryData(logType);
    }, [logType]);

    const queryData = (_logType = logType) => {
        // console.log("queryData", _logType)
        fetchMockLogData().then(res => {
            if (res.data.length === 0 && currentPage > 1) {
                return setCurrentPage(currentPage - 1);
            }
            setData(res.data);
            setTotal(res.total || 0);
        })
    }

    const gotoErrorDetail = (record) => {
        // console.log("gotoErrorDetail", record)
    }

    return (<div className='flow-log-wrapper'>
        {contextHolder}
        <div className='flow-log-header'>
            <span className='flow-log-title'>Log</span>
            <div className='log-type-wrapper'>
                <Dropdown
                    trigger={['hover']}
                    menu={{
                        items: Object.keys(LOG_TYPE).map(item => ({
                            key: item,
                            label: LOG_TYPE_LABEL[item],
                        })),
                        onClick: ({ key }) => {
                            setLogType(key)
                        }
                    }}>
                    <div className='log-type-text'>
                        Log Type: {logType}
                        <DownOutlined style={{ marginLeft: "10px" }} />
                    </div>

                </Dropdown>
                <Divider type="vertical" />
                <Button icon={<RedoOutlined />} onClick={() => { queryData() }}>
                    Refresh
                </Button>
            </div>

        </div>

        <Table
            size="small"
            rowKey="id"
            columns={columns}
            dataSource={data}
            scroll={{ y: "300px" }}
            pagination={{
                total: total,
                pageSize: PAGESIZE,
                current: currentPage,
                onChange: setCurrentPage
            }}
        />
    </div>)
}

export default memo(Log)