import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Popover } from 'antd';
import { addNewNode } from '../util';
import { useSelector } from 'react-redux';
import { selectorFlow, setNodePopFocus, setNodePopOpen } from '@/store/modules/flowSlice';
import { useMyDispatch } from '@/store';
import Connector from '../Connector';

export default (props) => {
    const {
        steps,
        componentMap,
        triggerMap,
        flowError,
        structure,
        selectorRange,
    } = useSelector(selectorFlow);
    const dispatch = useMyDispatch();

    const [open, setOpen] = useState(false);

    const onOpenChange = (open) => {
        if (selectorRange) {
            dispatch(setSelectorRange(null));
        }
        dispatch(setNodePopFocus(open));
        dispatch(setNodePopOpen(open));
        setOpen(open)
    }

    const onSelect = async (id, snapshot) => {
        const results = await addNewNode({
            // tenantId: appInfo.tenantId,
            // appId: appInfo.appId,
            origin: id,
            target: props.id,
            steps,
            structure,
            nodeConfig: componentMap[id]
            // nodeConfig: snapshot ? snapshotComponentMap[id] : componentMap[id]
        });
        dispatch(setSteps(results.steps));
        dispatch(setStructure(results.structure));
        dispatch(setActiveNodeId(results.id));
        dispatch(setNodePopFocus(false));
        setOpen(false);
    }

    return (
        <Popover
            className="flow-node-popover"
            placement="right"
            content={<Connector onSelect={onSelect} />}
            open={open}
            onOpenChange={onOpenChange}
            trigger="click"
        >
            {props.children}
        </Popover>
    )
}