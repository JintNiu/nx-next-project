import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Stage, Container, Graphics } from '@pixi/react';
import * as PIXI from "pixi.js";    // 必须，加了才能是canvas元素事件生效
import { Button, Popover, Space, Tooltip, message } from 'antd';
import { PlusOutlined, MinusOutlined, AimOutlined, ReloadOutlined, CopyOutlined } from '@ant-design/icons';

import { NODE, LINE, TYPE, SPACE, COLOR, BRANCH, ELEMENT, PATHCONNECTOR, SELECTOR, ACTION, GOTO } from './constant';

import Node from './Node';
import Line from './Line';
import Loop from './Branch/Loop';
import Branch from './Branch/Branch';
import Folder from './Branch/Folder';
import NodePopover from './Popover/Node';
import SelectorPopover from './Popover/Selector';
import AddPopover from './Popover/Add';
import MiniMap from './MiniMap';
import Toolbox from './Toolbox';

import { getSubListIds, formatXY, copyNodes, addNewNode, addNewBranch } from './util';

import './index.scss';
// import InputDragCanvas from '../ConfigForm/InputDragCanvas';
// import { useComponentData } from '../../common/commonUtils/component';
import { useMyDispatch } from '@/store';
import { useSelector } from 'react-redux';
import { selectorFlow, setActiveNodeId, setCenterNodeId, setDrag, setFoldedMap, setNodePopFocus, setSelectorRange, setSteps, setStructure } from '@/store/modules/flowSlice';
import { ActionDataContext } from './context';

const SHARK = {
    addNode: 'Add Node',// getShark('page_add_node', 'Add Node'),
    pasteNode: 'Paste Node',// getShark('page_paste_node', 'Paste Node'),
    expandNode: 'Expand Node',// getShark('page_expand_node', 'Expand Node'),
    collapseNode: 'Collapse Node',// getShark('page_collapse_node', 'Collapse Node'),
    addBranch: 'Add Branch',// getShark('page_add_branch', 'Add Branch'),
}

export default forwardRef(({ }, ref) => {
    const dispatch = useMyDispatch();
    const {
        editing,
        componentMap, triggerMap,
        structure, steps,
        activeNodeId,
        centerNodeId,
        paste,
        nodePopOpen,
        nodePopFocus,
        foldedMap,
        selectorRange,// 框选的范围坐标集，有值的时候显示蓝色框框和推拽div
        drag,
        flowError,
    } = useSelector(selectorFlow);

    const view = useRef(null);
    const containerRef = useRef(null);
    const timer = useRef();
    const [app, setApp] = useState();

    // const componentData = useComponentData()

    const [messageApi, contextHolder] = message.useMessage();
    /**
     * 状态
     */
    const [overAddId, setOverAddId] = useState(null);
    const dataContextValue = useMemo(() => ({
        editing,
        overAddId
    }), [editing, overAddId]);


    /**
     * 画布操作
     * 放大、缩小、移动
     */
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [scale, setScale] = useState(1);
    const [x, setX] = useState(0);
    const [y, setY] = useState(50);
    // 监听画布大小
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            setWidth(entry.contentRect.width);
            setHeight(entry.contentRect.height);
        });
        resizeObserver.observe(view.current);

        const disableDefaultWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };
        window.addEventListener('wheel', disableDefaultWheel, { passive: false });

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('wheel', disableDefaultWheel);
        }
    }, []);

    // 滚轮事件：控制位置、大小
    const wheel = useCallback((e) => {
        const n = performance.now();
        if (timer.current && n - timer.current < 16) {
            return e.preventDefault();
        }
        timer.current = n;
        if (e.ctrlKey) {
            // 放大缩小
            if (e.wheelDelta > 0) {
                // 向上滚动
                setScale((preScale) => {
                    if (preScale < 1.5) {
                        return Math.min((preScale * 10 + 1) / 10, 1.5)
                    } else {
                        return preScale
                    }
                });
            } else if (e.wheelDelta < 0) {
                // 向下滚动
                setScale((preScale) => {
                    if (preScale > 0.3) {
                        return Math.max((preScale * 10 - 1) / 10, 0.3)
                    } else {
                        return preScale
                    }
                });
            }
        } else {
            // 上下移动
            if (e.wheelDelta > 0) {
                setScale((scale = 1) => {
                    setY((preY) => {
                        return preY + 60 / scale;
                    });
                    return scale;
                })

            } else if (e.wheelDelta < 0) {
                setScale((scale = 1) => {
                    setY((preY) => {
                        return preY - 60 / scale;
                    });
                    return scale;
                })
            }
        }
        e.preventDefault();
    }, []);
    const onStageOver = (e) => {
        // console.log('[Stage]', 'onMouseOver', 'onStageOver')
        window.addEventListener('wheel', wheel, { passive: false });
    }
    const onStageOut = () => {
        // console.log('[Stage]', 'onMouseOut', 'onStageOut')
        window.removeEventListener('wheel', wheel);
    }

    useEffect(() => {
        if (!centerNodeId) {
            return;
        }

        const filter = (children) => {
            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (child instanceof PIXI.Graphics && child._type === ELEMENT.NODE) {
                    const { _id } = child;

                    if (_id === centerNodeId) {
                        return child;
                    }
                } else if (child instanceof PIXI.Container) {
                    if (child.children && child.children.length) {
                        const node = filter(child.children);
                        if (node) {
                            return node;
                        }
                    }
                }
            }
        }
        const node = filter(containerRef.current.children);

        if (node) {
            const bound = node.getBounds();
            const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);
            setX(0 - node.width / 2 - left);
            setY((height / 2) / scale - top - node.height);
        }

        dispatch(setCenterNodeId(null))
    }, [centerNodeId])


    // 画布元素点击才会触发的操作
    const [overPointer, setOverPointer] = useState(null);       // 节点浮层
    const [overFolder, setOverFolder] = useState(null);         // 展开收起浮层
    const [overAdd, setOverAdd] = useState(null);               // 添加浮层
    const [overBranch, setOverBranch] = useState(null);         // 添加分支浮层
    const [gotoOverId, setGotoOverId] = useState(null);
    const onNodeClick = () => {
        if (overPointer && overPointer.id) {
            let _id;
            if (overPointer.id === activeNodeId) {
                _id = null;
            } else {
                _id = overPointer.id;
            }
            dispatch(setActiveNodeId(_id));
        }
        if (selectorRange) {
            dispatch(setSelectorRange(null))
        }
    }
    const onFolderClick = () => {
        if (overFolder && overFolder.id) {
            // setFoldedMap((preState) => {
            //     const folded = preState[overFolder.id];
            //     return {
            //         ...preState,
            //         [overFolder.id]: !folded
            //     }
            // });

            dispatch(setFoldedMap({
                ...foldedMap,
                [overFolder.id]: !preState[overFolder.id]
            }))
        }
        if (selectorRange) {
            dispatch(setSelectorRange(null))
        }
    }
    const onAddTipOpenChange = (open) => {
        if (open && overAdd) {
            setOverAddId(overAdd.id)
        } else {
            setOverAddId(null);
        }
    }
    const onPasteClick = () => {
        if (!paste || !overAdd) {
            return;
        }
        const newStructure = JSON.parse(JSON.stringify(structure));
        let newSteps = { ...steps };

        const copy = copyNodes(paste.nodes, newSteps, paste.originSteps);
        const { id } = overAdd;

        const filter = (items) => {
            let i = 0;
            do {
                const item = items[i];
                const { id: nodeId, subNodes, type } = item;
                if (nodeId === id) {
                    // 选中了
                    if (
                        (type.startsWith('loop_') && (type.endsWith('_child') || type.endsWith('_default')))
                        || (type.startsWith('while_') && (type.endsWith('_child') || type.endsWith('_default')))
                        || (type.startsWith('branch_') && (type.endsWith('_child') || type.endsWith('_default')))
                    ) {
                        if (!item.subNodes) {
                            item.subNodes = [];
                        }
                        item.subNodes.unshift(...copy.nodes);
                    } else {
                        items.splice(i + 1, 0, ...copy.nodes);
                    }
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

        dispatch(setStructure(newStructure))
        dispatch(setSteps(newSteps))
        cleanPopover();
    }
    const onAddBranchClick = () => {
        if (overBranch && overBranch.id) {
            const results = addNewBranch(overBranch.id, steps, structure);
            dispatch(setStructure(results.structure))
            dispatch(setSteps(results.steps))
        }
        if (selectorRange) {
            dispatch(setSelectorRange(null))
        }
    }
    const onGlobalPointerTap = (e) => {
        const n = performance.now();
        if (timer.current && n - timer.current < 16) {
            return;
        }
        timer.current = n;
        // console.log('[Container]', 'onPointerTap', 'onGlobalPointerTap')
        const target = e.target;
        const { _id, _type } = target;
        switch (_type) {
            default:
                break;
        }
    }
    const onGlobalMouseDown = (e) => {
        const n = performance.now();
        if (timer.current && n - timer.current < 16) {
            return;
        }
        timer.current = n;
        // console.log('[Container]', 'onMouseDown', 'onGlobalMouseDown')
        if (selectorRange) {
            dispatch(setSelectorRange(null))
        }
        if (editing && activeNodeId && e.target._id !== activeNodeId) {
            // 编辑模式下，画布内的任何点击，取消选中节点
            dispatch(setActiveNodeId(null));
        }
        e.preventDefault();
    }
    const onGlobalPointerOver = (e) => {
        const n = performance.now();
        if (timer.current && n - timer.current < 16) {
            return;
        }
        timer.current = n;

        // console.log('[Container]', 'onPointerOver', 'onGlobalPointerOver')
        if (!nodePopFocus && !nodePopOpen && !selectStartPoint.current) {
            if (e.target._type === ELEMENT.NODE) {
                const { _id, _image, _subListIds, _nodeType } = e.target;

                const bound = e.target.getBounds();
                const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);
                setOverPointer({
                    id: _id,
                    icon: _image,
                    x: left,
                    y: top,
                    width: e.target.width,
                    height: e.target.height,
                    length: _subListIds.length,
                    nodeType: _nodeType,
                    subListIds: _subListIds,
                    // disableEdit: canvasType === 'compose' && [TYPE.COMPOSE_INPUT, TYPE.COMPOSE_OUTPUT].includes(_nodeType),//禁止修改信息（浮层不出现），禁止拖拽
                });
                if (_nodeType === 'goto') {
                    setGotoOverId(_id);
                }
            } else if (e.target._type === ELEMENT.ADDNODE) {
                const { _prev } = e.target;

                const bound = e.target.getBounds();
                const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);
                setOverAdd({
                    x: left,
                    y: top,
                    width: e.target.width,
                    height: e.target.height,
                    id: _prev
                });
            } else if (e.target._type === ELEMENT.FOLDER) {
                const { _id, _number, _folded } = e.target;

                const bound = e.target.getBounds();
                const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);
                setOverFolder({
                    id: _id,
                    x: left,
                    y: top,
                    width: e.target.width,
                    height: e.target.height,
                    number: _number,
                    folded: _folded
                });
            } else if (e.target._type === ELEMENT.ADDBRANCH) {
                const { _id } = e.target;

                const bound = e.target.getBounds();
                const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);
                setOverBranch({
                    id: _id,
                    x: left,
                    y: top,
                    width: e.target.width,
                    height: e.target.height,
                });
            }
        }
    }

    // 清理所有canvas over浮层
    const cleanPopover = () => {
        setOverPointer(null);
        setOverFolder(null);
        setOverAdd(null);
        setOverBranch(null);
        dispatch(setNodePopFocus(false))
        setGotoOverId(null);
    }

    // 按住空格键拖动画布模式
    const [grab, setGrab] = useState(false);
    const timerKeydown = useRef(0);
    useEffect(() => {
        const keydown = (e) => {
            const n = performance.now();
            if (timerKeydown.current && n - timerKeydown.current < 200) {
                return;
            }
            timerKeydown.current = n;
            if (e.keyCode === 32) {
                setGrab(true);
            }
        }
        const keyup = (e) => {
            if (e.keyCode === 32) {
                setGrab((preGrab) => {
                    if (preGrab && editing) {
                        // 编辑态的时候，如果空格键回弹了，则终止移动
                        onMoveEnd();
                    }
                    return false;
                });
            }
        }
        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);

        if (selectorRange !== null) {
            dispatch(setSelectorRange(null))
        }

        return () => {
            window.removeEventListener('keydown', keydown);
            window.removeEventListener('keyup', keyup);
        }
    }, [editing]);

    // 移动画布、框选
    const movePoint = useRef(null);     // 移动点位
    const selectStartPoint = useRef(null);   // 框选开始点位
    const autoMove = useRef();                  // 框选到边上时，自动移动
    const selectors = useRef([]);
    const selectorDom = useRef();           // 框选范围的dom ref，用于浮层定位
    const [selectEndPoint, setSelectEndPoint] = useState(null); // 框选结束点位
    const [rangeOver, setRangeOver] = useState(false);  // 鼠标移到框选范围内时，阻止canvas事件
    const onMove = useCallback((e) => {
        if (!movePoint.current) {
            return;
        }
        const n = performance.now();
        if (timer.current && n - timer.current < 16) {
            return;
        }
        timer.current = n;
        const { x, y, scale = 1 } = movePoint.current;
        const { clientX, clientY } = e;
        if (x !== clientX) {
            setX((preX) => {
                return preX + (clientX - x) / scale
            })
        }
        if (y !== clientY) {
            setY((preY) => {
                return preY + (clientY - y) / scale
            })
        }
        movePoint.current = {
            x: clientX,
            y: clientY,
            scale
        };
    }, []);
    const onMoveStart = (e) => {
        if (e.target.nodeName !== 'CANVAS') {
            return;
        }
        if (e.button !== 0) {
            return;
        }
        // console.log('[DIV.view]', 'onMouseDown', 'onMoveStart')
        if (!grab) {
            dispatch(setActiveNodeId(null));
        }

        if (editing && !grab) {
            // 取消节点浮层
            cleanPopover();
            // 框选
            const nodes = [];
            const nodeMap = {};
            let ignoreFirst = false;
            const filter = (children) => {
                children.forEach(child => {
                    if (child instanceof PIXI.Graphics && child._type === ELEMENT.NODE) {
                        if (!ignoreFirst) {
                            // 第一个触发器不能框选
                            ignoreFirst = true;
                            return;
                        }
                        // if (canvasType === 'compose' && [TYPE.COMPOSE_INPUT, TYPE.COMPOSE_OUTPUT].includes(child._nodeType)) {
                        //     // 复合组件管理：开始节点和结束节点不能框选
                        //     return;
                        // }
                        const { _id, _image, _path, _subListIds } = child;
                        const bound = child.getBounds();

                        const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);

                        nodeMap[_id] = {
                            id: _id,
                            path: _path,
                            left,
                            top,
                            right: left + child.width,
                            bottom: top + child.height,
                            image: _image,
                            cLeft: left,
                            cTop: top,
                            cRight: left + child.parent.width,
                            cBottom: top + child.parent.height,
                            subListIds: _subListIds
                        };
                        nodes.push(_id);
                    } else if (child instanceof PIXI.Container) {
                        if (child._type === ELEMENT.SUBCONTAINER) {
                            const bound = child.getBounds();
                            const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);

                            if (nodeMap[child._id]) {
                                nodeMap[child._id].cLeft = left;
                                nodeMap[child._id].cRight = left + child.width;
                                nodeMap[child._id].cBottom = top + child.height;
                            }
                        }
                        if (child.children && child.children.length) {
                            filter(child.children);
                        }
                    }
                })
            }
            filter(containerRef.current.children);

            const rect = e.target.getBoundingClientRect();
            selectStartPoint.current = {
                ...formatXY(e.clientX - rect.left, e.clientY - rect.top, x, y, width, scale),
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                nodes,
                nodeMap,
            };
            dispatch(setSelectorRange(null))
            dispatch(setActiveNodeId(null));
            window.getSelection().empty();  // 取消选中内容，防止变成拖拽
            window.addEventListener('mousemove', onSelectMove);
            window.addEventListener('mouseup', onMoveEnd);  // 框选操作鼠标移出范围不会注销事件，需要mouseup触发，移出范围后只能靠window触发mouseup
        } else {
            // 拖拽移动
            movePoint.current = {
                x: e.clientX,
                y: e.clientY,
                scale
            };
            view.current.addEventListener('mousemove', onMove);
        }
    };
    const onMoveEnd = useCallback((e) => {
        // console.log('[DIV.view]', e && e.type, 'onMoveEnd')
        if (movePoint.current) {
            view.current.removeEventListener('mousemove', onMove);
            movePoint.current = null;
        }
        if (selectStartPoint.current && e && e.type === 'mouseup') {
            window.removeEventListener('mousemove', onSelectMove);
            window.removeEventListener('mouseup', onMoveEnd);
            setSelectEndPoint(null);
            selectStartPoint.current = null;
            selectors.current = [];
            if (autoMove.current) {
                clearInterval(autoMove.current);
            }
        }
    }, []);
    const onSelectMove = useCallback((e) => {
        if (autoMove.current) {
            clearInterval(autoMove.current);
        }

        if (!selectStartPoint.current) {
            return;
        }
        const n = performance.now();
        if (timer.current && n - timer.current < 16) {
            return;
        }
        timer.current = n;
        const { left, right, top, bottom } = selectStartPoint.current;
        const clientX = e.clientX < left ? left : e.clientX > right ? right : e.clientX;
        const clientY = e.clientY < top ? top : e.clientY > bottom ? bottom : e.clientY;
        const shifting = 50;
        const time = 32;
        if (clientX <= left) {
            autoMove.current = setInterval(() => {
                setX((x) => {
                    return x + shifting
                });
            }, time);
        } else if (clientX >= right) {
            autoMove.current = setInterval(() => {
                setX((x) => {
                    return x - shifting
                });
            }, time);
        } else if (clientY <= top) {
            autoMove.current = setInterval(() => {
                setY((y) => {
                    return y + shifting
                });
            }, time);
        } else if (clientY >= bottom) {
            autoMove.current = setInterval(() => {
                setY((y) => {
                    return y - shifting
                });
            }, time);
        }
        setSelectEndPoint({
            x: clientX - left,
            y: clientY - top
        });
    }, []);
    useEffect(() => {
        // 判断选中的node
        if (selectEndPoint && selectStartPoint.current) {
            const { x: endX, y: endY } = formatXY(selectEndPoint.x, selectEndPoint.y, x, y, width, scale);
            const { x: startX, y: startY, nodes, nodeMap } = selectStartPoint.current;

            const range = {
                left: Math.min(startX, endX),
                right: Math.max(startX, endX),
                top: Math.min(startY, endY),
                bottom: Math.max(startY, endY)
            };

            let targetPath = '';
            // "__root|branch-1|branch-1.child-2|branch-2|branch-2.child-1";
            if (selectors.current.length && selectors.current[0] && nodeMap[selectors.current[0]]) {
                // 判断父级是否已经被包含进去了，如进去了，直接切换到父级选中线路
                const { path } = nodeMap[selectors.current[0]];
                const parents = path.split(PATHCONNECTOR);
                let change = false;

                if (parents.length > 1) {
                    let pId = parents.shift();
                    while (!change && pId) {
                        const pNode = nodeMap[pId];
                        if (pNode) {
                            const { left, right, top, bottom, path } = pNode;
                            const isOverlap = left < range.right && right > range.left && top < range.bottom && bottom > range.top;
                            if (isOverlap) {
                                change = true;
                                targetPath = path;
                            }
                        }
                        pId = parents.shift();
                    }
                }

                if (!change) {
                    // 没切换到父级，则检查原来的路径是否还在范围内
                    selectors.current.some((id) => {
                        const node = nodeMap[id];
                        if (!node) {
                            return;
                        }
                        const { left, right, top, bottom, path } = node;
                        const isOverlap = left < range.right && right > range.left && top < range.bottom && bottom > range.top;
                        if (isOverlap) {
                            targetPath = path;
                            return true;
                        }
                    });
                }
            }

            const newSelectors = [];
            nodes.forEach((id) => {
                const node = nodeMap[id];
                if (!node) {
                    return;
                }

                const { left, right, top, bottom, path } = node;

                if (targetPath && path !== targetPath) {
                    return;
                }

                const isOverlap = left < range.right && right > range.left && top < range.bottom && bottom > range.top;
                if (isOverlap) {
                    newSelectors.push(id)
                    if (!targetPath) {
                        // 第一个进入范围的作为锚点路径
                        targetPath = path;
                    }
                }
            });
            selectors.current = newSelectors;

            const key = newSelectors.join('+');
            if (!key) {
                if (selectorRange !== null) {
                    dispatch(setSelectorRange(null))
                }
            } else if (!selectorRange || selectorRange.key !== key) {
                let minX;
                let minY;
                let maxX;
                let maxY;
                let icon;
                const allSelectors = [];
                newSelectors.forEach((id, i) => {
                    const { cLeft, cRight, cTop, cBottom, image, subListIds } = nodeMap[id];
                    if (i === 0) {
                        minX = cLeft;
                        minY = cTop;
                        maxX = cRight;
                        maxY = cBottom;
                        icon = image;
                    } else {
                        if (cLeft < minX) {
                            minX = cLeft;
                        }
                        if (cRight > maxX) {
                            maxX = cRight;
                        }
                        if (cTop < minY) {
                            minY = cTop;
                        }
                        if (cBottom > maxY) {
                            maxY = cBottom;
                        }
                    }
                    allSelectors.push(id);
                    if (subListIds && subListIds.length) {
                        allSelectors.push(...subListIds);
                    }
                });

                dispatch(setSelectorRange({
                    key,
                    minX: minX - SELECTOR.PADDING,
                    minY: minY - SELECTOR.PADDING / 2,
                    maxX: maxX + SELECTOR.PADDING,
                    maxY: maxY + SELECTOR.PADDING / 2,
                    selectors: allSelectors,
                    icon,
                }))
            }
        }
    }, [selectEndPoint, x, y, scale]);
    useEffect(() => {
        // 任何布局变化，清空选择框
        if (selectorRange !== null) {
            dispatch(setSelectorRange(null))
        }
        cleanPopover();
    }, [structure]);

    // 拖拽移动节点
    const [dropNode, setDropNode] = useState(null);     // 放置的目标位置（key, prev, next）
    const onSelectorDragStart = (e) => {
        e.dataTransfer.setDragImage(e.target.childNodes[0], scale * NODE.WIDTH / 2, scale * NODE.HEIGHT / 2);
        dispatch(setDrag({
            type: ACTION.MOVE,
            selectors: selectorRange.selectors
        }))
    }
    const onNodeDragStart = (e) => {
        e.dataTransfer.setDragImage(e.target.childNodes[0], scale * NODE.WIDTH / 2, scale * NODE.HEIGHT / 2);
        dispatch(setDrag({
            type: ACTION.MOVE,
            selectors: [overPointer.id]
        }));
    }
    const onDragEnd = (e) => {
        dispatch(setDrag(null));
        setDropNode(null);
    }
    const addNodes = useMemo(() => {
        if (!drag) {
            return null;
        }
        const { selectors = [] } = drag;
        const nodes = [];
        const filter = (children) => {
            children.forEach(child => {
                if (child instanceof PIXI.Container) {
                    if (child._type === ELEMENT.SUBCONTAINER && selectors.includes(child._id)) {
                        return;
                    }
                    if (child._type === ELEMENT.ADDNODE) {
                        if (selectors.includes(child._prev) || selectors.includes(child._next)) {
                            return;
                        }

                        const bound = child.getBounds();
                        const { left, top } = formatXY(bound.x, bound.y, x, y, width, scale);

                        const { _prev, _next } = child;

                        nodes.push({
                            key: _prev + _next,
                            prev: _prev,
                            next: _next,
                            left,
                            top,
                            width: child.width,
                            height: child.height
                        });
                    }
                    if (child.children && child.children.length) {
                        filter(child.children);
                    }
                }
            })
        }
        filter(containerRef.current.children);
        return nodes;
    }, [drag, x, y, width, scale]);
    const onDragEnter = (e) => {
        if (!drag) {
            return;
        }

        if (e.target.dataset.prev) {
            const { prev, next } = e.target.dataset;
            const key = prev + next;
            if (!dropNode || dropNode.key !== key) {
                setDropNode({
                    key,
                    prev,
                    next,
                });
            }
        } else if (drag.type === ACTION.ADD && addNodes[addNodes.length - 1]) {
            const { key, prev, next } = addNodes[addNodes.length - 1];
            setDropNode({
                key,
                prev,
                next,
            });
        } else {
            setDropNode(null);
        }
    }
    const onDrop = async (e) => {
        if (!drag || !dropNode) {
            return;
        }
        if (drag.type === ACTION.MOVE) {
            // 移动
            const selectors = [...drag.selectors];
            const newData = JSON.parse(JSON.stringify(structure));
            const nodes = [];

            const filter = (items) => {
                let i = 0;
                do {
                    const { id, subNodes } = items[i];
                    const index = selectors.indexOf(id);
                    if (index > -1) {
                        // 选中了
                        selectors.splice(index, 1);
                        nodes.push(items.splice(i, 1)[0]);
                    } else {
                        if (subNodes && subNodes.length) {
                            filter(subNodes);
                        }
                        i++;
                    }
                } while (i < items.length && selectors.length)
            }
            filter(newData);

            const target = dropNode.prev;
            const move = (items) => {
                items.some((item, i) => {
                    const { id, type } = item;
                    if (target === id) {
                        if (
                            (type.startsWith('loop_') && (type.endsWith('_child') || type.endsWith('_default')))
                            || (type.startsWith('while_') && (type.endsWith('_child') || type.endsWith('_default')))
                            || (type.startsWith('branch_') && (type.endsWith('_child') || type.endsWith('_default')))
                        ) {
                            if (!item.subNodes) {
                                item.subNodes = [];
                            }
                            item.subNodes.unshift(...nodes);
                        } else {
                            items.splice(i + 1, 0, ...nodes);
                        }
                        return true;
                    } else if (item.subNodes && item.subNodes.length) {
                        move(item.subNodes);
                    }
                });
            }
            move(newData);
            // console.log('===============', newData)
            dispatch(setStructure(newData))
        } else if (drag.type === ACTION.ADD) {
            // 新增
            console.log("drag", drag)
            // console.log("dropNode", dropNode)
            const results = await addNewNode({
                tenantId: appInfo.tenantId,
                appId: appInfo.appId,
                origin: drag.id,
                target: dropNode.prev,
                steps,
                structure,
                nodeConfig: componentMap[drag.id]
            });
            // console.log("results", results)
            dispatch(setSteps(results.steps));
            dispatch(setStructure(results.structure));
            dispatch(setActiveNodeId(results.id));
        }
        dispatch(setDrag(null));
        setDropNode(null);
        setRangeOver(false);

        cleanPopover();
    }

    // 小地图
    const [miniImage, setMiniImage] = useState(null);
    const [miniOpen, setMiniOpen] = useState(false);
    const handleMiniOpenChange = (open) => {
        if (open) {
            setMiniOpen(true);
            setMiniImage(null);

            app.renderer.extract.image(containerRef.current).then(img => {
                setMiniImage({
                    src: img.src,
                    width: img.width,
                    height: img.height
                });
            })
        } else {
            setMiniOpen(false);
        }
    }

    useImperativeHandle(ref, () => ({
        getFlowImage: async () => {
            try {
                return app.renderer.extract.image(containerRef.current)
            } catch (err) {
                console.warn('===getFlowImage error===', err);
                return Promise.reject(err);
            }
        },
    }));

    const handleMiniClick = (x, y) => {
        setX(x);
        setY(height * 0.5 / scale - y);
    }

    const canvasView = useMemo(() => {
        /**
         * 动态节点渲染
         * @param {*} nodes
         * @param {*} isRoot
         * @returns
         */
        const render = (nodes, isRoot, parentPath, parentSelected) => {
            let w = 0;
            let y = 0;
            const listIds = [];
            const results = [];
            const lines = [];
            const { selectors = [] } = selectorRange || {};
            const { errorMap = {} } = flowError;
            nodes && nodes.forEach(({ id, type, subNodes }, i) => {
                const selected = parentSelected || selectors.includes(id);
                /**
                 * 获取名字和icon
                 */
                const node = steps[id];
                let { name, nameEn = '', componentId } = node;
                let icon;
                const code = id.split('.')[0].replace(/_\d+$/, '');
                if (type.toLocaleLowerCase() === TYPE.TRIGGER) {
                    icon = (triggerMap[code] || {}).iconUrl;
                } else {
                    icon = (componentMap[code] || {}).iconUrl;
                }

                // 本节点高度
                const nodeProps = {
                    // key: `node_${id}`,
                    renderKey: `node_${id}`,
                    image: icon,
                    x: 0,
                    y,
                    type: activeNodeId === id || selected ? TYPE.ACTIVE : (errorMap[id] ? TYPE.ERROR : TYPE.DEFAULT),
                    // title: isZH ? name : nameEn,
                    title: name,
                    id,
                    path: parentPath,
                    nodeType: type,
                }
                y += NODE.HEIGHT;
                listIds.push(id);

                if (code === 'goto') {
                    nodeProps.relatedId = node.relation?.relatedId;
                }

                //
                let folderProps = null;
                let subContainer = null;
                const subListIds = [];
                if (subNodes && subNodes.length) {
                    let subWidth = 0;
                    let subHeight = 0;

                    const folded = !!foldedMap[id];
                    if (!folded) {
                        if (type.startsWith('branch_') && type.endsWith('_parent')) {
                            const branches = [];
                            const arrWidth = [];
                            const arrHeight = [];
                            subNodes.forEach((child, i) => {
                                // 并行网关不渲染默认子分支（并行网关其实本就没有default）
                                if (TYPE.BRANCH_PARALLEL_PARENT === type && child.id.endsWith('.default')) {
                                    return;
                                }
                                const { width, height, nodes, listIds } = render(
                                    child.subNodes,
                                    false,
                                    [parentPath, id, child.id].join(PATHCONNECTOR),
                                    selected
                                );
                                const itemHeight = BRANCH.NAME_HEIGHT + (height ? BRANCH.SHORT_ADD_HEIGHT + height : BRANCH.LONG_ADD_HEIGHT);

                                arrWidth.push(width);
                                arrHeight.push(itemHeight);

                                if (i > 0) {
                                    // 第二条分支开始，增加360左边距
                                    subWidth += SPACE;
                                }
                                let name = (child.type.startsWith('branch_') && child.type.endsWith('_default'))
                                    ? 'Default'
                                    : (steps[child.id]?.name || child.id.slice(child.id.lastIndexOf('.') + 1));// node.input.branches.value[child.id].value.label.value;

                                branches.push(
                                    <Branch.Item
                                        key={`branch_child_${child.id}`}
                                        renderKey={`branch_child_${child.id}`}
                                        name={name}
                                        x={subWidth}
                                        width={width}
                                        selected={selected}
                                        branchId={child.id}
                                        firstChildId={child.subNodes && child.subNodes[0] && child.subNodes[0].id}
                                    >
                                        {nodes}
                                    </Branch.Item>
                                );

                                subWidth += width;
                                subHeight = Math.max(subHeight, itemHeight);
                                subListIds.push(...listIds);
                            })

                            subContainer = (
                                <Branch
                                    renderKey={`branch_${id}`}
                                    key={`branch_${id}`}
                                    width={arrWidth}
                                    height={arrHeight}
                                    y={y}
                                    id={id}
                                    selected={selected}
                                >
                                    {branches}
                                </Branch>
                            )
                            subHeight += BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 4 + BRANCH.NAME_PADDING_TOP;   // 增加分支外框默认高度
                        } else if (type === TYPE.LOOP_SERIAL_PARENT || type === TYPE.LOOP_PARALLEL_PARENT || type === TYPE.WHILE_PARENT) {
                            const child = subNodes[0];

                            const oneBranch = render(
                                child.subNodes,
                                false,
                                [parentPath, id, child.id].join(PATHCONNECTOR),
                                selected
                            );
                            subContainer = (
                                <Loop
                                    key={`loop_${id}`}
                                    renderKey={`loop_${id}`}
                                    width={oneBranch.width}
                                    height={oneBranch.height}
                                    y={y}
                                    id={id}
                                    selected={selected}
                                    branchId={child.id}
                                    firstChildId={child.subNodes && child.subNodes[0] && child.subNodes[0].id}
                                >
                                    {oneBranch.nodes}
                                </Loop>
                            )
                            subWidth = oneBranch.width + SPACE;
                            subHeight = (oneBranch.height ? oneBranch.height + BRANCH.SHORT_ADD_HEIGHT : BRANCH.LONG_ADD_HEIGHT) + BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 3; // 内容高度 + 容器高度
                            subListIds.push(...oneBranch.listIds);
                        }
                    } else {
                        subNodes.forEach((child) => {
                            subListIds.push(...getSubListIds(child.subNodes));
                        })
                    }

                    w = Math.max(w, subWidth);
                    listIds.push(...subListIds);

                    folderProps = {
                        key: `folder_${id}`,
                        renderKey: `folder_${id}`,
                        id: id,
                        x: 0,
                        y: 0 - subHeight,
                        folded,
                        number: subListIds.length,
                        subListIds
                    }

                    y += subHeight;
                }

                // type: default active error
                results.push(
                    <Node key={nodeProps.renderKey} {...nodeProps} subListIds={subListIds} />
                );
                if (subContainer) {
                    results.push(subContainer);
                }

                const isLast = !nodes[i + 1];
                const showArrow = isLast ? (
                    isRoot ? (
                        editing ? false : true
                    ) : false
                ) : true;
                const size = isLast ? (
                    isRoot ? LINE.SHORT_SIZE : LINE.LANG_SIZE
                ) : LINE.LANG_SIZE;

                // 复合组件：结束节点后没线，不可新增节点
                if (TYPE.COMPOSE_OUTPUT === type) {
                    return;
                }
                const lineSelected = parentSelected || (selected && selectors.includes((nodes[i + 1] || {}).id));   // 自身选中，并且下一个也选中了才展示蓝色
                lines.push(
                    <Line
                        key={`line_${id}`}
                        renderKey={`line_${id}`}
                        x={0}
                        y={y}
                        showArrow={showArrow}
                        size={size}
                        placement={isRoot && isLast ? 'bottom' : 'middle'}
                        selected={lineSelected}
                        prev={id}
                        next={nodes[i + 1] && nodes[i + 1].id}
                        end={type === 'goto' || type === 'terminate'}
                    >
                        {
                            folderProps ? (
                                <Folder {...folderProps} />
                            ) : null
                        }
                    </Line>
                )
                y += size;
            });

            return {
                width: w,
                height: y,
                nodes: [...results, ...lines],
                listIds,
            };
        }
        return render(structure, true, '__root').nodes;
    }, [structure, selectorRange, flowError, activeNodeId, steps, foldedMap, editing, componentMap]);

    const gotoLine = useMemo(() => {
        const nodeXY = {};
        const relation = [];
        const loop = (nodes, x, y) => {
            nodes && nodes.forEach(({ key, props }) => {
                if (props.renderKey.startsWith('node_')) {
                    nodeXY[props.id] = [x + props.x, y + props.y];
                    if (props.nodeType === 'goto' && props.relatedId && nodeXY.hasOwnProperty(props.relatedId)) {
                        relation.push([props.id, props.relatedId]);
                    }
                } else if (props.renderKey.startsWith('loop_')) {
                    loop(props.children, x + SPACE / 2, y + props.y + BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 2 + BRANCH.SHORT_ADD_HEIGHT);
                } else if (props.renderKey.startsWith('branch_')) {
                    const centerX = (props.width.reduce((prev, curr) => (prev + curr)) + SPACE * (props.width.length - 1)) / 2;
                    props.children.forEach(branch => {
                        loop(
                            branch.props.children,
                            x + (branch.props.x - centerX + branch.props.width / 2),
                            y + props.y + BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 2 + BRANCH.NAME_PADDING_TOP + BRANCH.SHORT_ADD_HEIGHT + BRANCH.NAME_HEIGHT
                        )
                    });
                }
            })
        }
        loop(canvasView, 0, 0);

        const points = [];
        relation.forEach(([from, to], i) => {
            if (nodeXY.hasOwnProperty(from) && nodeXY.hasOwnProperty(to)) {
                points.push([nodeXY[from], nodeXY[to], from]);
            }
        })
        return points;
    }, [canvasView])

    // 第一个节点id
    const firstNodeId = useMemo(() => {
        return structure.length ? structure[0].id : '';
    }, [structure])


    // useEffect(() => {
    //     setOverAddId(null);

    //     setScale(1);
    //     setX(0);
    //     setY(50);

    //     setOverPointer(null);
    //     setOverFolder(null);
    //     setOverAdd(null);
    //     setOverBranch(null);
    //     setFoldedMap({});

    //     setGrab(false);
    //     setSelectEndPoint(null);
    //     setRangeOver(false);

    //     setDropNode(null);

    //     setMiniImage(null);
    //     setMiniOpen(false);
    // }, [visit])

    return (
        <>
            {contextHolder}

            <div className="flow-view-wrapper">
                <div
                    className="flow-view bg-canvas"
                    ref={view}
                    onMouseDown={onMoveStart}
                    onMouseOut={onMoveEnd}
                    onMouseUp={onMoveEnd}
                    style={{
                        cursor: grab ? 'grab' : 'auto',
                        // pointerEvents: activeNodeId ? "none" : 'unset'
                    }}
                >
                    <Stage
                        width={width}
                        height={height}
                        options={{ backgroundAlpha: 0, antialias: true }}
                        onMount={setApp}
                        onMouseOver={onStageOver}
                        onMouseOut={onStageOut}
                    >
                        <ActionDataContext.Provider value={dataContextValue}>
                            <Container
                                position={[width * 0.5, 0]}
                                scale={scale}
                                ref={containerRef}
                                pivot={{
                                    x: 0 - x,
                                    y: 0 - y
                                }}
                                eventMode={rangeOver ? 'none' : 'auto'}
                                // onpointertap={onGlobalPointerTap}
                                onmousedown={onGlobalMouseDown}
                                onpointerover={onGlobalPointerOver}
                            >
                                {
                                    selectorRange && (
                                        <Graphics
                                            draw={(g) => {
                                                const { minX, minY, maxX, maxY } = selectorRange;
                                                g.clear();
                                                g.beginFill(COLOR.BLUE02, 1);
                                                g.drawRoundedRect(
                                                    minX,
                                                    minY,
                                                    maxX - minX,
                                                    maxY - minY,
                                                    SELECTOR.RADIUS
                                                );
                                                g.endFill();
                                            }}
                                        />
                                    )
                                }

                                {
                                    canvasView
                                }

                                {
                                    gotoLine && gotoLine.length > 0 && (
                                        <Graphics
                                            draw={(g) => {
                                                g.clear();

                                                gotoLine.forEach(([from, to, id]) => {
                                                    const color = 0x722ED1;  // 0x909AC1;
                                                    const alpha = gotoOverId === id ? 1 : 0.4;

                                                    g.lineStyle(2, color, alpha);

                                                    const isRight = from[0] > to[0];
                                                    const fromX = from[0] - NODE.WIDTH / 2;
                                                    const fromY = from[1] + NODE.HEIGHT / 2;
                                                    const toX = isRight ? to[0] + NODE.WIDTH / 4 : to[0] - NODE.WIDTH / 4;
                                                    const toY = to[1];
                                                    let x = fromX;
                                                    let y = fromY;

                                                    // 起点
                                                    g.moveTo(x, y);

                                                    // 向左偏移一节点宽度
                                                    x = fromX - GOTO.LEFT + GOTO.RADIUS;
                                                    g.lineTo(x, y);
                                                    y = y - GOTO.RADIUS;
                                                    g.arc(x, y, GOTO.RADIUS, 0.5 * Math.PI, 1 * Math.PI);

                                                    // 向上移动到Y轴位置
                                                    x = fromX - GOTO.LEFT;
                                                    y = toY - GOTO.TOP + GOTO.RADIUS;
                                                    g.lineTo(x, y);

                                                    if (isRight) {
                                                        x = x - GOTO.RADIUS;
                                                        g.arc(x, y, GOTO.RADIUS, 0 * Math.PI, -0.5 * Math.PI, true);
                                                    } else {
                                                        x = x + GOTO.RADIUS;
                                                        g.arc(x, y, GOTO.RADIUS, 1 * Math.PI, 1.5 * Math.PI);
                                                    }

                                                    // 移动至节点上方
                                                    x = isRight ? toX + GOTO.RADIUS : toX - GOTO.RADIUS;
                                                    y = toY - GOTO.TOP;
                                                    g.lineTo(x, y);
                                                    y = y + GOTO.RADIUS;
                                                    if (isRight) {
                                                        g.arc(x, y, GOTO.RADIUS, -0.5 * Math.PI, -1 * Math.PI, true);
                                                    } else {
                                                        g.arc(x, y, GOTO.RADIUS, 1.5 * Math.PI, 0 * Math.PI);
                                                    }

                                                    // 到终点
                                                    x = toX;
                                                    y = toY - 2;
                                                    g.lineTo(x, y);
                                                    g.endFill();

                                                    // 箭头
                                                    g.lineStyle(1, color, alpha);
                                                    g.beginFill(color, alpha);
                                                    y = y + 1;
                                                    g.moveTo(x, y);
                                                    g.lineTo(x - 3, y - 8);
                                                    g.lineTo(x + 3, y - 8);
                                                    g.lineTo(x, y);
                                                    g.endFill();
                                                })

                                            }}
                                        />
                                    )
                                }

                                {
                                    selectEndPoint && <Graphics draw={(g) => {
                                        const { x: startX, y: startY } = selectStartPoint.current;
                                        const { x: endX, y: endY } = formatXY(selectEndPoint.x, selectEndPoint.y, x, y, width, scale);

                                        g.clear();
                                        g.beginFill(COLOR.BLUE, 0.2);
                                        g.lineStyle(2, COLOR.BLUE, 1);
                                        g.drawRect(
                                            Math.min(startX, endX),
                                            Math.min(startY, endY),
                                            Math.abs(endX - startX),
                                            Math.abs(endY - startY)
                                        );
                                        g.endFill();
                                    }} />
                                }
                            </Container>
                        </ActionDataContext.Provider>
                    </Stage>

                    {
                        !drag && !nodePopFocus && overFolder && (
                            <Tooltip title={overFolder.folded ? SHARK.expandNode : SHARK.collapseNode}>
                                <div
                                    className="flow-folder-over"
                                    style={{
                                        width: overFolder.width * scale,
                                        height: overFolder.height * scale,
                                        left: (overFolder.x + x) * scale + width / 2,
                                        top: (overFolder.y + y) * scale,
                                        borderRadius: BRANCH.RADIUS * scale,
                                    }}
                                    onClick={onFolderClick}
                                ></div>
                            </Tooltip>
                        )
                    }
                    {
                        !drag && overAdd && (
                            <div
                                className="flow-add-over"
                                style={{
                                    left: (overAdd.x + x) * scale + width / 2,
                                    top: (overAdd.y + y) * scale
                                }}
                            >
                                <AddPopover id={overAdd.id}>
                                    <Tooltip title={SHARK.addNode} onOpenChange={onAddTipOpenChange}>
                                        <div
                                            className="flow-add-over-add"
                                            style={{
                                                width: overAdd.width * scale,
                                                height: overAdd.height * scale,
                                                borderRadius: LINE.ADD_BUTTON_RADIUS * scale,
                                            }}
                                        ></div>
                                    </Tooltip>
                                </AddPopover>
                                {
                                    !nodePopFocus && paste && (
                                        <Tooltip title={SHARK.pasteNode}>
                                            <div
                                                className="flow-add-over-paste"
                                                style={{
                                                    width: (overAdd.width - 4) * scale,
                                                    height: (overAdd.height - 4) * scale,
                                                    borderRadius: LINE.ADD_BUTTON_RADIUS * scale,
                                                    marginLeft: 10 * scale,
                                                }}
                                                onClick={onPasteClick}
                                            ><CopyOutlined style={{ zoom: scale }} /></div>
                                        </Tooltip>
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        !drag && !nodePopFocus && overBranch && (
                            <Tooltip title={SHARK.addBranch}>
                                <div
                                    className="flow-folder-over"
                                    style={{
                                        width: overBranch.width * scale,
                                        height: overBranch.height * scale,
                                        left: (overBranch.x + x) * scale + width / 2,
                                        top: (overBranch.y + y) * scale,
                                        borderRadius: BRANCH.ADD_BRANCH_RADIUS * scale,
                                    }}
                                    onClick={onAddBranchClick}
                                ></div>
                            </Tooltip>
                        )
                    }

                    {
                        drag && addNodes && addNodes.length > 0 && (
                            <div
                                className="flow-add-items"
                                onDragOver={(e) => { e.preventDefault(); }}
                                onDragEnter={onDragEnter}
                                onDrop={onDrop}
                            >
                                {
                                    addNodes.map((item) => {
                                        const active = dropNode && dropNode.key === item.key;
                                        return (
                                            <div
                                                key={item.key}
                                                className={active ? 'flow-add-item flow-add-item-active' : 'flow-add-item'}
                                                style={{
                                                    width: (active ? LINE.DROP_MAX_SIZE : item.width) * scale,
                                                    height: (active ? LINE.DROP_MAX_SIZE : item.height) * scale,
                                                    left: (item.left + x + item.width / 2) * scale + width / 2,
                                                    top: (item.top + y + item.height / 2) * scale
                                                }}
                                                data-prev={item.prev}
                                                data-next={item.next}
                                            >
                                                <div
                                                    data-prev={item.prev}
                                                    data-next={item.next}
                                                    style={active ? { boxShadow: `0 0 0 ${LINE.DROP_MAX_SIZE * scale}px rgb(50, 136, 255, 0.1)` } : null}
                                                ></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
                {
                    overPointer && (
                        <NodePopover
                            id={overPointer.id}
                            editing={editing}
                            nodeType={overPointer.nodeType}
                            subListIds={overPointer.subListIds}
                            disableEdit={overPointer.disableEdit}
                            message={messageApi}
                        >
                            <div
                                className="flow-drag-node"
                                style={{
                                    width: overPointer.width * scale,
                                    height: overPointer.height * scale,
                                    left: (overPointer.x + x) * scale + width / 2,
                                    top: (overPointer.y + y) * scale,
                                    borderRadius: NODE.RADIUS * scale,
                                }}
                                draggable={!!editing && !overPointer.disableEdit && overPointer.id !== firstNodeId && !nodePopFocus && !selectorRange}
                                onDragStart={onNodeDragStart}
                                onDragEnd={onDragEnd}
                                onClick={onNodeClick}
                            >
                                <div
                                    className={`flow-drag-node-content${overPointer.length > 2 ? ' selector-multi' : overPointer.length === 2 ? ' selector-double' : ''}`}
                                    style={{ zoom: scale }}
                                ><img src={overPointer.icon} /></div>
                            </div>
                        </NodePopover>
                    )
                }
                {
                    !selectEndPoint && selectorRange && (
                        <SelectorPopover selectors={selectorRange.selectors} message={messageApi}>
                            <div
                                className="flow-drag-selector"
                                style={{
                                    width: (selectorRange.maxX - selectorRange.minX) * scale,
                                    height: (selectorRange.maxY - selectorRange.minY) * scale,
                                    left: (selectorRange.minX + x) * scale + width / 2,
                                    top: (selectorRange.minY + y) * scale
                                }}
                                onMouseOver={(e) => { setRangeOver(true) }}
                                onMouseOut={(e) => { setRangeOver(false) }}

                                draggable={true}
                                onDragStart={onSelectorDragStart}
                                onDragEnd={onDragEnd}
                                ref={selectorDom}
                            >
                                <div
                                    className={`flow-drag-selector-content${selectorRange.selectors.length > 2 ? ' selector-multi' : selectorRange.selectors.length === 2 ? ' selector-double' : ''}`}
                                    style={{ zoom: scale }}
                                ><img src={selectorRange.icon} /></div>
                            </div>
                        </SelectorPopover>

                    )
                }

                <Toolbox editing={editing} />

                <div className="flow-action-btns">
                    <Space>
                        {
                            scale !== 1 && (
                                <>
                                    <span>{parseInt(scale * 100)}%</span>
                                    <Button
                                        type="text"
                                        icon={<ReloadOutlined />}
                                        size="small"
                                        onClick={() => {
                                            setScale(1)
                                        }}
                                    />
                                </>
                            )
                        }

                        <Button
                            type="text"
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() => {
                                if (scale > 0.3) {
                                    setScale((scale * 10 - 1) / 10);
                                }
                            }}
                        />
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => {
                                if (scale < 1.5) {
                                    setScale((scale * 10 + 1) / 10);
                                }
                            }}
                        />
                        <Popover
                            placement="topRight"
                            content={<MiniMap image={miniImage} onClick={handleMiniClick} />}
                            trigger="click"
                            open={miniOpen}
                            onOpenChange={handleMiniOpenChange}
                            destroyTooltipOnHide
                            arrow={false}
                        >
                            <Button type="text" icon={<AimOutlined />} size="small" />
                        </Popover>
                    </Space>
                </div>

            </div>
            {/* <InputDragCanvas x={x} y={y} width={width} height={height} scale={scale} container={containerRef.current} /> */}
        </>
    )
})
