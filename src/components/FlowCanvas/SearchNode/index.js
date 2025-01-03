import React, { useMemo, useState } from 'react';
import { Empty } from 'antd';
import { CheckOutlined, CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import InputSearch from '../../common/InputSearch';
import { TYPE } from '../constant';

import './index.scss';
// import { getComponentInfoFormSnapshot } from '../../../common/commonUtils/component';
import { useMyDispatch } from '@/store';
import { useSelector } from 'react-redux';
import { selectorFlow, setActiveNodeId, setCenterNodeId, setFoldedMap, setSelectorRange } from '@/store/modules/flowSlice';
import { getI18n, isZH } from '@/utils/i18n';

const SHARK = {
    search: getI18n('action_search', 'Search'),
    notFound: getI18n('tip_not_found', 'Not Found'),
}

export default ({ }) => {
    const dispatch = useMyDispatch();
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

    const [keyword, setKeyword] = useState('');

    const allNodes = useMemo(() => {
        const all = [];
        const loop = (nodes, level, parentId) => {
            nodes && nodes.forEach(({ id, type, subNodes }, i) => {
                /**
                 * 获取名字和icon
                 */
                const node = steps[id];
                let { name, nameEn, componentId } = node;
                let icon;
                const code = id.split('.')[0].replace(/_\d+$/, '');
                if (type === TYPE.TRIGGER) {
                    icon = (triggerMap[code] || {}).iconUrl;
                } else {
                    icon = (componentMap[code] || {}).iconUrl;
                    // const obj = getComponentInfoFormSnapshot(code, componentId, componentMap, snapshotComponentMap) || {}
                    // icon = obj.iconUrl;
                }

                all.push({
                    id,
                    title: isZH ? name : nameEn,
                    nodeType: type,
                    icon: icon,
                    parentId,
                    level,
                });

                if (subNodes && subNodes.length) {
                    subNodes.forEach((child, i) => {
                        loop(child.subNodes, level + 1, [...parentId, id]);
                    })
                }

            })
        }
        loop(structure, 0, []);
        return all
    }, [structure]);

    const nodes = useMemo(() => {
        const key = keyword.toLowerCase();

        let parentId = [];
        const list = [];

        for (let i = allNodes.length - 1; i >= 0; i--) {
            const n = allNodes[i];
            if (n.id.toLowerCase().indexOf(key) > -1 || n.title.toLowerCase().indexOf(key) > -1) {
                list.unshift(n);
                if (n.parentId && n.parentId.length) {
                    parentId = [...new Set(parentId.concat(n.parentId))];
                }
            } else if (parentId.includes(n.id)) {
                list.unshift(n);
            }
        }

        return {
            parentId,
            list
        }
    }, [allNodes, keyword])


    const selectNode = (id) => {
        if (selectorRange) {
            dispatch(setSelectorRange(null));
        }
        dispatch(setActiveNodeId(id));
        dispatch(setCenterNodeId(id));
    }

    const onExpand = (id) => {
        dispatch(setFoldedMap({
            ...foldedMap,
            [id]: !folded
        }))
    }

    return (
        <div className="flow-search-node-wrapper" >
            <div>
                <InputSearch placeholder={SHARK.search} onChange={setKeyword} />
            </div>
            {
                nodes && nodes.list.length > 0 ? (
                    <div
                        className="flow-search-node-list"
                    >
                        {
                            nodes.list.map((item) => {
                                if (item.parentId && item.parentId.length && item.parentId.find(id => foldedMap[id])) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={item.id}
                                        className={activeNodeId === item.id ? "flow-search-node-item active" : "flow-search-node-item"}
                                        onClick={() => { selectNode(item.id) }}
                                    >
                                        <div
                                            className="flow-search-node-item-padding"
                                            style={{ marginLeft: item.level * 15 }}
                                            onClick={(e) => {
                                                onExpand(item.id);
                                                e.stopPropagation();
                                            }}
                                        >
                                            {
                                                nodes.parentId.includes(item.id) ? (
                                                    foldedMap[item.id] ? (
                                                        <CaretRightOutlined />
                                                    ) : (
                                                        <CaretDownOutlined />
                                                    )
                                                ) : null
                                            }
                                        </div>
                                        <img src={item.icon} />
                                        <div className="flow-search-node-item-content">
                                            <div className="flow-search-node-item-title" title={item.title}>{item.title}</div>
                                            <div className="flow-search-node-item-id">{item.id}</div>
                                        </div>
                                        <CheckOutlined />
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={SHARK.notFound}></Empty>
                )
            }
        </div>
    )
}