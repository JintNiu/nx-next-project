import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Popover, Tooltip, Divider, Popconfirm } from 'antd';
import { CopyOutlined, DeleteOutlined, ScissorOutlined } from '@ant-design/icons';

import './index.scss';
import { ACTION } from '../constant';
import { useSelector } from 'react-redux';
import { selectorFlow, setPaste, setSteps, setStructure } from '@/store/modules/flowSlice';
import { getI18n } from '@/utils/i18n';
import { useMyDispatch } from '@/store';

const SHARK = {
    cutNodeTotal: getI18n('page_cut_node_total', 'Cut ${total} node(s).'),
    copyNodeTotal: getI18n('page_copy_node_total', 'Copied ${total} node(s).'),
    nodeSelectedTotal: getI18n('page_node_selected_total', '${total} Node(s) Selected'),
    copyNode: getI18n('page_copy_nodes', 'Copy Node(s)'),
    cutNode: getI18n('page_cut_nodes', 'Cut Node(s)'),
    deleteNode: getI18n('page_delete_nodes', 'Delete Node(s)'),
    deleteNodeTip: getI18n('page_delete_node_tip', 'Delete the node'),
    sureDeleteNodeTip: getI18n('page_sure_delete_node_tip', 'Are you sure to delete the selected node(s)?'),
    yes: getI18n('action_yes', 'Yes'),
    no: getI18n('action_not', 'No'),
}

export default ({ children, selectors, message }) => {
    const { focus, drag, steps, structure, componentMap, triggerMap, activeNodeId, } = useSelector(selectorFlow);
    const dispatch = useMyDispatch();

    const handleDelete = () => {
        const newStructure = JSON.parse(JSON.stringify(structure));
        const newSteps = { ...steps };

        const filter = (items) => {
            let i = 0;
            do {
                const { id, subNodes } = items[i];
                const index = selectors.indexOf(id);
                if (index > -1) {
                    // 选中了
                    items.splice(i, 1);
                } else {
                    if (subNodes && subNodes.length) {
                        filter(subNodes);
                    }
                    i++;
                }
            } while (i < items.length);
        }
        filter(newStructure);

        Object.keys(newSteps).forEach((id) => {
            if (selectors.includes(id.split('.')[0])) {
                delete newSteps[id]
            }
        });

        dispatch(setStructure(newStructure))
        dispatch(setSteps(newSteps))
    }

    const handleCut = () => {
        const newStructure = JSON.parse(JSON.stringify(structure));
        const newSteps = { ...steps };
        const nodes = [];
        const originSteps = {};

        const filter = (items) => {
            let i = 0;
            do {
                const { id, subNodes } = items[i];
                const index = selectors.indexOf(id);
                if (index > -1) {
                    // 选中了
                    nodes.push(items.splice(i, 1)[0]);
                } else {
                    if (subNodes && subNodes.length) {
                        filter(subNodes);
                    }
                    i++;
                }
            } while (i < items.length);
        }
        filter(newStructure);

        Object.keys(newSteps).forEach((id) => {
            if (selectors.includes(id.split('.')[0])) {
                originSteps[id] = newSteps[id];
                delete newSteps[id]
            }
        });

        dispatch(setStructure(newStructure))
        dispatch(setSteps(newSteps))
        dispatch(setPaste({
            type: ACTION.CUT,
            nodes,
            originSteps,
        }));
        message.open({
            type: 'success',
            content: SHARK.cutNodeTotal.replace('${total}', selectors.length),
        });
    }

    const handleCopy = () => {
        const newStructure = JSON.parse(JSON.stringify(structure));
        const nodes = [];
        const originSteps = {};

        const filter = (items) => {
            let i = 0;
            do {
                const { id, subNodes } = items[i];
                const index = selectors.indexOf(id);
                if (index > -1) {
                    // 选中了
                    nodes.push(items[i]);
                } else if (subNodes && subNodes.length) {
                    filter(subNodes);
                }
                i++
            } while (i < items.length);
        }
        filter(newStructure);

        Object.keys(steps).forEach((id) => {
            if (selectors.includes(id.split('.')[0])) {
                originSteps[id] = steps[id];
            }
        });

        setPaste({
            type: ACTION.COPY,
            nodes,
            originSteps: JSON.parse(JSON.stringify(originSteps)),
        });
        message.open({
            type: 'success',
            content: SHARK.copyNodeTotal.replace('${total}', selectors.length),
        });
    }

    const content = useMemo(() => {
        return (
            <div className="flow-selector-popover-content">
                <span>{SHARK.nodeSelectedTotal.replace('${total}', selectors.length)}</span>
                <Divider type="vertical" />
                <Tooltip title={SHARK.copyNode}>
                    <Button size="small" type="text" icon={<CopyOutlined />} onClick={handleCopy}></Button>
                </Tooltip>
                <Tooltip title={SHARK.cutNode}>
                    <Button size="small" type="text" icon={<ScissorOutlined />} onClick={handleCut}></Button>
                </Tooltip>
                <Tooltip title={SHARK.deleteNode}>
                    <Popconfirm
                        title={SHARK.deleteNodeTip}
                        description={SHARK.sureDeleteNodeTip}
                        onConfirm={handleDelete}
                        okText={SHARK.yes}
                        cancelText={SHARK.no}
                    >
                        <Button size="small" type="text" icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                </Tooltip>
            </div>
        )
    }, [selectors, structure, steps]);

    return (
        <Popover
            className="flow-selector-popover"
            placement="top"
            content={content}
            open={!drag}
            arrow={false}
            getPopupContainer={() => {
                return children.ref.current;
            }}
        >
            {children}
        </Popover>
    )
}