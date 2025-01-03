import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Collapse, Empty } from 'antd';

import './index.scss';
import { ACTION, TYPE } from '../constant';
import InputSearch from '../../common/InputSearch';
// import { useComponentData } from '../../../common/commonUtils/component';
import { useSelector } from 'react-redux';
import { selectorFlow } from '@/store/modules/flowSlice';
import { useMyDispatch } from '@/store';
import { getI18n, isZH } from '@/utils/i18n';

const SHARK = {
    notFound: getI18n('tip_not_found', 'Not Found'),
    search: getI18n('action_search', 'Search'),
}

export default ({ mode = 'list', onSelect }) => {
    const { editing, componentMap, triggerMap, structure, steps, activeNodeId,
        centerNodeId,
        paste,
        nodePopOpen,
        nodePopFocus,
        foldedMap,
        selectorRange,// 框选的范围坐标集，有值的时候显示蓝色框框和推拽div
        drag,
        flowError,
    } = useSelector(selectorFlow);
    const dispatch = useMyDispatch();

    const [keyword, setKeyword] = useState('');
    const [tabId, setTabId] = useState('');
    // const componentData = useComponentData()

    const connectors = useMemo(() => {
        const group = {};
        const sort = {
            logic: 1,
            helper: 2,
            connector: 3,
            biz: 3,
            compose: 4,
            snapshot: 5,
        }
        Object.keys(componentMap).forEach((key) => {
            const item = componentMap[key];
            if (keyword && item.titleEn.toLowerCase().indexOf(keyword.toLowerCase()) === -1 && item.title.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
                return;
            }

            // disabledShowType：all-所有画布均禁用; process-流程画布禁用; compose-复合组件画布禁用
            const { componentType, componentCode, disabledShowType } = item;

            if (!group[componentType]) {
                group[componentType] = {
                    key: componentType,
                    name: isZH ? item.componentTypeLabel : item.componentTypeLabelEn,
                    children: [],
                    sort: sort[componentType] || 1000
                };
            }
            group[componentType].children.push({
                id: componentCode,
                name: isZH ? item.title : item.titleEn,
                icon: item.iconUrl
            });
        });

        // 连接器connector和业务biz合并展示
        if (group['biz'] && group['connector']) {
            group['biz'].children = [
                ...group['biz'].children,
                ...group['connector'].children
            ]
            delete group['connector'];
        }

        const result = Object.keys(group).map((key => {
            const item = group[key];
            item.children = item.children.sort((a, b) => a.sort - b.sort);
            return item;
        })).sort((a, b) => a.sort - b.sort);

        if (!tabId && result[0]) {
            setTabId(result[0].key);
        }
        console.log('result', result)
        return result;
    }, [componentMap, keyword]);

    const onDragStart = (e) => {
        const target = e.target.nodeName === 'IMG' ? e.target.parentNode : e.target;
        e.dataTransfer.setDragImage(target.childNodes[0], 20, 20);
        dispatch(setDrag({
            type: ACTION.ADD,
            selectors: [],
            id: target.dataset.id,
            snapshot: target.dataset.snapshot,
        }))
        if (selectorRange) {
            dispatch(setSelectorRange(null))
        }
    }
    const onDragEnd = (e) => {
        dispatch(setDrag(null));
    }

    const onClick = (e) => {
        let target = e.target;
        if (target.nodeName !== 'DIV') {
            target = target.parentNode;
        }
        if (target.nodeName === 'DIV' && target.dataset.id) {
            typeof onSelect === 'function' && onSelect(target.dataset.id, target.dataset.snapshot);
        }
    }

    return (
        <div className="flow-connector-wrapper" style={mode === 'list' ? { maxHeight: 360, width: 305 } : { width: 240 }}>
            <div>
                <InputSearch placeholder={SHARK.search} onChange={setKeyword} />
            </div>
            {
                keyword ? (
                    connectors.length ? (
                        <Collapse
                            className="flow-connector-collapse"
                            defaultActiveKey={connectors.map(item => item.key)}
                            ghost
                            items={
                                connectors.map((group) => {
                                    return {
                                        key: group.key,
                                        label: group.name,
                                        children: (
                                            <div
                                                {
                                                ...(mode === 'list' ? {
                                                    className: 'flow-connector-list',
                                                    onClick,
                                                } : {
                                                    className: 'flow-connector-flex',
                                                    onDragStart,
                                                    onDragEnd,
                                                })
                                                }
                                            >
                                                {
                                                    group.children.map((item) => {
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                data-id={item.id}
                                                                data-snapshot={item.snapshot}
                                                                className="flow-connector-item"
                                                                draggable={mode === 'drag'}
                                                            >
                                                                <img src={item.icon} />
                                                                <span>{item.name}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                })
                            }
                        ></Collapse>
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={SHARK.notFound}></Empty>
                    )

                ) : (
                    <Tabs
                        className="flow-connector-tabs"
                        activeKey={tabId}
                        onChange={setTabId}
                        items={
                            connectors.map((group => {
                                return {
                                    key: group.key,
                                    label: group.name,
                                    children: (
                                        <div
                                            {
                                            ...(mode === 'list' ? {
                                                className: 'flow-connector-list',
                                                onClick,
                                            } : {
                                                className: 'flow-connector-flex',
                                                onDragStart,
                                                onDragEnd,
                                            })
                                            }
                                        >
                                            {
                                                group.children.map((item) => {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            data-id={item.id}
                                                            data-snapshot={item.snapshot}
                                                            className="flow-connector-item"
                                                            draggable={mode === 'drag'}
                                                        >
                                                            <img src={item.icon} />
                                                            <span>{item.name}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }
                            }))
                        }
                    />
                )
            }
        </div>
    )
}