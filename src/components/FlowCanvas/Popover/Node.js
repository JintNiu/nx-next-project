import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Popover, Input, Tooltip, Popconfirm, Switch } from 'antd';
import { CopyOutlined, DeleteOutlined, SisternodeOutlined, SwapOutlined } from '@ant-design/icons';
import './index.scss';
import { TYPE, ACTION } from '../constant';
import { copyNodes, getSubListIds } from '../util';
import { getI18n } from '@/utils/i18n';
import { useSelector } from 'react-redux';
import { selectorFlow, setActiveNodeId, setNodePopFocus, setNodePopOpen, setPaste, setSteps, setStructure } from '@/store/modules/flowSlice';
import { useMyDispatch } from '@/store';

const SHARK = {
    createCopy: getI18n('page_create_copy', 'Create a Copy'),
    createCopyNodeSuccessful: getI18n('page_create_copy_node_successful', 'Successfully created a copy.'),
    copyNodeSuccessful: getI18n('page_copy_node_successful', 'Successfully copy this node.'),
    copyNode: getI18n('page_copy_node', 'Copy Node'),
    deleteNode: getI18n('page_delete_node', 'Delete Node'),
    deleteNodeTip: getI18n('page_delete_node_tip', 'Delete the node'),
    sureDeleteNodeTip: getI18n('page_sure_delete_node_tip', 'Are you sure to delete the selected node(s)?'),
    yes: getI18n('action_yes', 'Yes'),
    no: getI18n('action_not', 'No'),

    isMainPath: getI18n('label_is_main_path', 'In Main Path'),
    pleaseInputName: getI18n('form_please_input_field', 'Please input ${name}', { name: getI18n('label_chinese_name', 'Chinese Name').toLocaleLowerCase() }),
    pleaseInputDesc: getI18n('form_please_input_field', 'Please input ${name}', { name: getI18n('label_chinese_desc', 'Chinese Description').toLocaleLowerCase() }),
    pleaseInputNameEn: getI18n('form_please_input_field', 'Please input ${name}', { name: getI18n('label_english_name', 'English Name').toLocaleLowerCase() }),
    pleaseInputDescEn: getI18n('form_please_input_field', 'Please input ${name}', { name: getI18n('label_english_desc', 'English Description').toLocaleLowerCase() }),

}

export default ({ children, id, editing, disableEdit, nodeType, subListIds = [], message }) => {
    const { focus, drag, steps, structure, componentMap, triggerMap, activeNodeId, } = useSelector(selectorFlow);
    const dispatch = useMyDispatch();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [desc, setDesc] = useState('');
    const [descEn, setDescEn] = useState('');
    const [inMainPath, setInMainPath] = useState(false);
    const changeData = useRef(null);

    useEffect(() => {
        return () => {
            // 修改过内容，浮层关闭的时候修改元数据
            if (focus && changeData.current && steps[id]) {
                setSteps((state) => {
                    const code = id.split('.')[0].replace(/_\d+$/, '');
                    const node = nodeType === TYPE.TRIGGER ? triggerMap[code] : componentMap[code];
                    if (changeData.current.hasOwnProperty('name') && !changeData.current.name) {
                        if (node) {
                            changeData.current.name = node.title || '';
                        }
                    }
                    if (changeData.current.hasOwnProperty('nameEn') && !changeData.current.nameEn) {
                        if (node) {
                            changeData.current.nameEn = node.titleEn || '';
                        }
                    }

                    const newState = { ...state };
                    newState[id] = {
                        ...newState[id],
                        ...changeData.current
                    }
                    return newState;
                });

                const code = id.split('.')[0].replace(/_\d+$/, '');
                const node = nodeType === TYPE.TRIGGER ? triggerMap[code] : componentMap[code];
                if (changeData.current.hasOwnProperty('name') && !changeData.current.name) {
                    if (node) {
                        changeData.current.name = node.title || '';
                    }
                }
                if (changeData.current.hasOwnProperty('nameEn') && !changeData.current.nameEn) {
                    if (node) {
                        changeData.current.nameEn = node.titleEn || '';
                    }
                }

                const newState = { ...steps };
                newState[id] = {
                    ...newState[id],
                    ...changeData.current
                }

                dispatch(setSteps(newState));
            }
        }
    }, [focus]);
    useEffect(() => {
        return () => {
            setOpen(false);
            dispatch(setNodePopFocus(false));
            dispatch(setNodePopOpen(false));
        }
    }, []);
    useEffect(() => {
        if (drag) {
            setOpen(false);
            dispatch(setNodePopFocus(false));
            dispatch(setNodePopOpen(false));
        }
    }, [drag]);
    useEffect(() => {
        if (open) {
            const data = steps[id] || {};
            setName(data.name);
            setDesc(data.description);
            setNameEn(data.nameEn || '');
            setDescEn(data.descriptionEn || '');
            setInMainPath(data.inMainPath);
            changeData.current = null;
        }
    }, [open, id])

    const onOpenChange = (open) => {
        setOpen(open);
        dispatch(setNodePopOpen(open));
        if (!open && focus) {
            dispatch(setNodePopFocus(false));
        }
    }

    const onChangeName = (e) => {
        setName(e.target.value);
        if (!changeData.current) {
            changeData.current = {};
        }
        changeData.current.name = e.target.value;
    }
    const onChangeDesc = (e) => {
        setDesc(e.target.value);
        if (!changeData.current) {
            changeData.current = {};
        }
        changeData.current.description = e.target.value;
    }
    const onChangeNameEn = (e) => {
        setNameEn(e.target.value);
        if (!changeData.current) {
            changeData.current = {};
        }
        changeData.current.nameEn = e.target.value;
    }
    const onChangeDescEn = (e) => {
        setDescEn(e.target.value);
        if (!changeData.current) {
            changeData.current = {};
        }
        changeData.current.descriptionEn = e.target.value;
    }

    const onChangeInMainPath = (v) => {
        setInMainPath(v);
        if (!changeData.current) {
            changeData.current = {};
        }
        changeData.current.inMainPath = v;
    }

    const content = useMemo(() => {
        return (
            <div className="flow-node-popover-content">
                <div>
                    <Input
                        onFocus={() => { dispatch(setNodePopFocus(true)) }}
                        maxLength={20}
                        placeholder={SHARK.pleaseInputName}
                        disabled={!editing}
                        value={name}
                        onChange={onChangeName}
                    />
                </div>
                <div>
                    <Input
                        onFocus={() => { dispatch(setNodePopFocus(true)) }}
                        maxLength={40}
                        placeholder={SHARK.pleaseInputNameEn}
                        disabled={!editing}
                        value={nameEn}
                        onChange={onChangeNameEn}
                    />
                </div>
                <div>
                    <Input.TextArea
                        onFocus={() => { dispatch(setNodePopFocus(true)) }}
                        maxLength={100}
                        autoSize
                        placeholder={SHARK.pleaseInputDesc}
                        disabled={!editing}
                        value={desc}
                        onChange={onChangeDesc}
                    />
                </div>
                <div>
                    <Input.TextArea
                        onFocus={() => { dispatch(setNodePopFocus(true)) }}
                        maxLength={200}
                        autoSize
                        placeholder={SHARK.pleaseInputDescEn}
                        disabled={!editing}
                        value={descEn}
                        onChange={onChangeDescEn}
                    />
                </div>
                <div>
                    {SHARK.isMainPath}:
                    <Switch
                        style={{ marginLeft: "10px" }}
                        onFocus={() => { dispatch(setFo(true)) }}
                        disabled={!editing}
                        checked={inMainPath}
                        onChange={onChangeInMainPath}
                    />
                </div>
            </div>
        )
    }, [id, editing, name, nameEn, desc, descEn, inMainPath]);


    const handleDelete = () => {
        const newStructure = JSON.parse(JSON.stringify(structure));
        const newSteps = { ...steps };

        const filter = (items) => {
            let i = 0;
            do {
                const { id: nodeId, subNodes } = items[i];
                if (nodeId === id) {
                    // 选中了
                    return items.splice(i, 1);
                }
                if (subNodes && subNodes.length) {
                    const del = filter(subNodes);
                    if (del) {
                        return del;
                    }
                }
                i++;

            } while (i < items.length)
        }
        filter(newStructure);

        const deleteIds = [id, ...subListIds];
        Object.keys(newSteps).forEach((id) => {
            if (deleteIds.includes(id.split('.')[0])) {
                delete newSteps[id]
            }
        });

        dispatch(setStructure(newStructure));
        dispatch(setSteps(newSteps));

        if (activeNodeId === id) {
            dispatch(setActiveNodeId(null));
        }

    }
    const handleCreateCopy = () => {
        const newStructure = JSON.parse(JSON.stringify(structure));
        let newSteps = { ...steps };

        const filter = (items) => {
            let i = 0;
            do {
                const { id: nodeId, subNodes } = items[i];
                if (nodeId === id) {
                    // 选中了
                    const nodes = [items[i]];

                    const copy = copyNodes(nodes, newSteps);
                    items.splice(i + 1, 0, ...copy.nodes);
                    newSteps = { ...newSteps, ...copy.steps };

                    return true;
                }
                if (subNodes && subNodes.length) {
                    const done = filter(subNodes);
                    if (done) {
                        return done;
                    }
                }
                i++;

            } while (i < items.length)
        }
        filter(newStructure);
        dispatch(setStructure(newStructure));
        dispatch(setSteps(newSteps));
        message.open({
            type: 'success',
            content: SHARK.createCopyNodeSuccessful,
        });
    }
    const handleCopy = () => {
        const nodes = [];
        const originSteps = {};

        const filter = (items) => {
            let i = 0;
            do {
                const { id: nodeId, subNodes } = items[i];
                if (nodeId === id) {
                    // 选中了
                    nodes.push(JSON.parse(JSON.stringify(items[i])));
                    return true;
                }
                if (subNodes && subNodes.length) {
                    const done = filter(subNodes);
                    if (done) {
                        return done;
                    }
                }
                i++;

            } while (i < items.length)
        }
        filter(structure);

        const selectors = getSubListIds(nodes);
        Object.keys(steps).forEach((id) => {
            if (selectors.includes(id.split('.')[0])) {
                originSteps[id] = steps[id];
            }
        });

        dispatch(setPaste({
            type: ACTION.COPY,
            nodes,
            originSteps: JSON.parse(JSON.stringify(originSteps)),
        }))

        message.open({
            type: 'success',
            content: SHARK.copyNodeSuccessful,
        });
    }

    const title = useMemo(() => {
        return (
            <div className="flow-node-popover-title">
                <div className="title">{id}</div>
                {
                    editing && (
                        <div className="btns">
                            {
                                nodeType === TYPE.TRIGGER ? (
                                    null
                                    // <Tooltip title="Swap a Trigger">
                                    //     <Button size="small" type="text" icon={<SwapOutlined />}>Swap</Button>
                                    // </Tooltip>
                                ) : (
                                    <>
                                        <Tooltip title={SHARK.copyNode}>
                                            <Button size="small" type="text" icon={<CopyOutlined />} onClick={handleCopy}></Button>
                                        </Tooltip>
                                        <Tooltip title={SHARK.createCopy}>
                                            <Button size="small" type="text" icon={<SisternodeOutlined />} onClick={handleCreateCopy} ></Button>
                                        </Tooltip>
                                        <Tooltip title={SHARK.deleteNode}>
                                            <Popconfirm
                                                title={SHARK.deleteNodeTip}
                                                description={SHARK.sureDeleteNodeTip}
                                                onConfirm={handleDelete}
                                                okText={SHARK.yes}
                                                cancelText={SHARK.no}
                                                placement="left"
                                            >
                                                <Button size="small" type="text" icon={<DeleteOutlined />}></Button>
                                            </Popconfirm>
                                        </Tooltip>
                                    </>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }, [id, editing, nodeType, structure, steps]);

    return (
        <Popover
            className="flow-node-popover"
            placement="leftTop"
            title={title}
            content={content}
            open={disableEdit ? false : open}
            onOpenChange={disableEdit ? null : onOpenChange}
            trigger={focus ? 'click' : 'hover'}
            mouseLeaveDelay={0.05}
            mouseEnterDelay={0.3}
        >
            {children}
        </Popover>
    )
}