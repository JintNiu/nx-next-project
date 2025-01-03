import { ExclamationCircleFilled, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Table, Tooltip } from 'antd';
import React, { useEffect, useState, memo, useMemo, useContext, useRef } from 'react';

import InputSearch from '../../common/InputSearch';

import './index.scss';
// import { post } from '../../../utils/request';
// import ConfigurationEditModal from '../../Config/ConfigurationEditModal'
// import { ConfigEditToolContext } from '../../Config/ConfigurationEditModal/context';
import { getI18n } from '@/utils/i18n';

const PAGESIZE = 10;

const SHARK = {
    name: getI18n('label_name', 'Name'),
    defaultValue: getI18n('label_default_value', 'Default value'),
    operation: getI18n('action_operation', 'Operation'),
    confirmDelete: getI18n('tip_confirm_delete', 'Confirm Delete'),
    deleteConfigTip: getI18n('tip_delete_config', 'Are you sure you want to delete the configuration(s)?'),
    confirm: getI18n('action_confirm', 'Confirm'),
    cancel: getI18n('action_cancel', 'Cancel'),
    delete: getI18n('action_delete', 'Delete'),
    queryFailed: getI18n('msg_query_failed', 'Query failed'),
    projectConfig: getI18n('page_project_config', 'Project Configuration'),
    searchForName: getI18n('msg_search_for_name', 'Search for Name'),
    createConfig: getI18n('action_create_config', 'Create Configuration'),
    deleteSuccessful: getI18n('msg_delete_success', 'Delete successful'),
    deleteFailed: getI18n('msg_delete_failed', 'Delete failed'),
}

const ConfigToolCard = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const [keyword, setKeyword] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(PAGESIZE);
    const [total, setTotal] = useState(0);
    // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    // const { onQueryConfig, onDeleteConfig } = useContext(ConfigEditToolContext) || {};

    const columns = [
        {
            title: SHARK.name,
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: SHARK.defaultValue,
            dataIndex: 'defaultValue',
            key: 'defaultValue',
            ellipsis: true,
            render: ({ value, type }) => {
                return value !== null ? (value + '') : '';
            }
        },
        // {
        //     title: 'current workflow referenced',
        //     dataIndex: 'referenced',
        //     key: 'referenced',
        //     ellipsis: true,
        //     render: (value) => {
        //         return <Tag color={value ? "processing" : "default"}>
        //             {value ? "未引用" : "已引用"}
        //         </Tag>
        //     }
        // },
        {
            title: SHARK.operation,
            key: 'operation',
            ellipsis: true,
            render: (value, record) => {
                return <Popconfirm
                    title={SHARK.confirmDelete}
                    description={SHARK.deleteConfigTip}
                    onConfirm={() => {
                        onDelete(record);
                    }}
                    // onCancel={cancel}
                    okText={SHARK.confirm}
                    cancelText={SHARK.cancel}
                >
                    <Button type='link'>{SHARK.delete}</Button>
                </Popconfirm>
            }
        },
    ]

    const onDelete = (data) => {
        if (typeof onDeleteConfig === 'function') {
            // onDeleteConfig({
            //     names: [data.name]
            // }).then(res => {
            //     if (res.errMsg) {
            //         messageApi.error(res.errMsg || SHARK.deleteFailed);
            //     } else {
            //         messageApi.success(SHARK.deleteSuccessful);
            //         queryData();
            //     }
            // })
        } else {
            // post('/api/application/deleteConfig', {
            //     appId: appInfo.appId,
            //     names: [data.name]
            // }).then(res => {
            //     if (res.errMsg) {
            //         messageApi.error(res.errMsg || SHARK.deleteFailed);
            //     } else {
            //         messageApi.success(SHARK.deleteSuccessful);
            //         queryData();
            //     }
            // })
        }
    }

    const changeValueTimer = useRef(0);
    useEffect(() => {
        clearTimeout(changeValueTimer.current);
        changeValueTimer.current = setTimeout(() => {
            queryData();
        }, 300)
    }, [keyword, currentPage, currentPageSize]);

    const queryData = async () => {
        // let res;
        // if (typeof onQueryConfig === 'function') {
        //     res = await onQueryConfig({
        //         name: keyword,
        //         page: currentPage,
        //         pageSize: currentPageSize,
        //     });
        // } else {
        //     res = await post('/api/application/queryConfigs', {
        //         appId: appInfo.appId,
        //         page: currentPage,
        //         pageSize: currentPageSize,
        //         name: keyword
        //     });
        // }
        // if (!res || res.errMsg) {
        //     messageApi.error(res?.errMsg || SHARK.queryFailed);
        //     setData([]);
        //     setTotal(0);
        //     setCurrentPage(1)
        //     return;
        // }
        // if (res.configs?.length === 0 && currentPage > 1) {
        //     return setCurrentPage(currentPage - 1);
        // }
        // setData(res.configs || []);
        // setTotal(res.total || 0);
    }

    const handleSaveConfig = () => {
        setModalOpen(false);
        queryData();
    }

    const handleChangePage = (page, pageSize) => {
        console.log('handleChangePage', page, pageSize);
        if (pageSize !== currentPageSize) {
            setCurrentPage(1);
        } else {
            setCurrentPage(page);
        }
        setCurrentPageSize(pageSize)
    }

    return (<div className='flow-config-wrapper'>
        {contextHolder}
        <div className='flow-config-header'>
            <span>
                <span className='flow-config-title'>{SHARK.projectConfig}</span>
                {/* <Tooltip title="===">
                    <InfoCircleOutlined style={{ marginLeft: "6px" }} />
                </Tooltip> */}
            </span>
            <div>
                <InputSearch
                    placeholder={SHARK.searchForName}
                    style={{ width: 250, marginRight: "10px" }}
                    value={keyword}
                    onChange={(value) => {
                        setCurrentPage(1);
                        setKeyword(value)
                    }}
                />
                <Button icon={<PlusOutlined />} onClick={() => { setModalOpen(true); }}>
                    {SHARK.createConfig}
                </Button>
            </div>

        </div>

        <Table
            size="small"
            rowKey="name"
            columns={columns}
            dataSource={data}
            scroll={{ y: "300px" }}
            // rowSelection={{
            //     type: "checkbox",
            //     selectedRowKeys: selectedRowKeys,
            //     onChange: (selectedRowKeys, selectedRows) => {
            //         setSelectedRowKeys(selectedRowKeys)
            //     },
            // }}
            pagination={{
                total,
                current: currentPage,
                pageSize: currentPageSize,
                showSizeChanger: true,
                // pageSizeOptions: [1, 2, 3],
                onChange: handleChangePage,
            }}
        />

        {/* {
            modalOpen && <ConfigurationEditModal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                }}
                onSave={handleSaveConfig}
            />
        } */}
    </div>)
}

export default memo(ConfigToolCard)