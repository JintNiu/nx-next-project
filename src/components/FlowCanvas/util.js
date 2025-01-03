import { ConsoleSqlOutlined } from "@ant-design/icons";
import { getUniqueKeyFromList, isArray } from "../../utils/array";
// import { post } from "../../utils/request";
// import listenerFormConfig from "../ConfigDrawer/NodeListenerTab/listenerFormConfig";
import { BRANCH_ID_INFIX, BRANCH_NAME_PREFIX, TYPE, VALUE_TYPE, FORM_TYPE, BRANCH_MIN_COUNT, SPECIAL_NODE_TYPE_MAP } from "./constant";


/**获取表单项初始值 */
export const getInitValueByType = (valueType) => {
    let initValue;
    switch (valueType) {
        case VALUE_TYPE.string: initValue = ''; break;
        case VALUE_TYPE.javascript: initValue = ''; break;
        case VALUE_TYPE.boolean: initValue = false; break;
        case VALUE_TYPE.number: initValue = undefined; break;
        case VALUE_TYPE.object: initValue = {}; break;
        case VALUE_TYPE.collection: initValue = []; break;
        case VALUE_TYPE.expression: initValue = ''; break;
        case VALUE_TYPE.date: initValue = null; break;
        case VALUE_TYPE.null: initValue = null; break;
        default: initValue = null; break;
    }
    return initValue;
}


/**新增分支时，获取分支名 */
export const getBranchName = (list = [], listFieldName) => {
    return getUniqueKeyFromList({
        list: list,
        prefix: BRANCH_NAME_PREFIX,
        listFieldName: listFieldName,
        ignoreZero: true,
    })
}

export const getBranchId = (list = [], id, listFieldName) => {
    return getUniqueKeyFromList({
        list: list,
        listFieldName: listFieldName,
        prefix: `${id}${BRANCH_ID_INFIX}`,
        ignoreZero: true,
    })
}


// 画布节点子结构
export const getBranchSubStep = (branchKey, actionCode) => {
    return {
        "id": branchKey,
        "type": (SPECIAL_NODE_TYPE_MAP['branch'][actionCode] || {}).child || "",
        "subNodes": []
    }
}

// 画布节点子类配置
export const getBranchStepChildConfig = (index, branchKey, actionCode) => {
    return {
        id: branchKey,
        name: `${BRANCH_NAME_PREFIX}${index}`,
        type: (SPECIAL_NODE_TYPE_MAP['branch'][actionCode] || {}).child || "",
    }
}

// input
export const getBranchInputValues = (normalStepChildConfig) => {
    const valueObject = {};
    for (const key in normalStepChildConfig) {
        valueObject[key] = {
            key: key,
            dataType: "object",
            value: {
                branch_condition: {
                    key: "branch_condition",
                    dataType: 'expression',
                    value: ""
                }
            }
        }
    }
    return {
        branches: {
            key: "branches",
            dataType: "object",
            value: valueObject
        }
    }
}

export const getSubListIds = (nodes) => {
    const listIds = [];
    nodes && nodes.forEach(({ id, subNodes }) => {
        listIds.push(id);

        if (subNodes && subNodes.length) {
            subNodes.forEach((child) => {
                listIds.push(...getSubListIds(child.subNodes));
            })
        }
    });
    return listIds;
}

export const formatXY = (clientX, clientY, x, y, width, scale) => {
    const left = (clientX - width / 2) / scale - x;
    const top = clientY / scale - y;
    return {
        x: left,
        y: top,
        left,
        top,
    }
}

// FIXME:DONE
// 1. 节点id重复：当branch_3在branch_2前时，会先把branch_3替换成2（这时有两个branch_2了），然后又把所有branch_2替换成3
// 2. 分支父节点条件丢失
// 3. 节点id重复：原有分支结构：1【3，2】，剪切后，新建分支1，再将原结构粘贴到任意位置，粘贴后的分支结构变为：4【3，4】
export const copyNodes = (nodes, allSteps = {}, originSteps = {}) => {
    let copyNodes = JSON.stringify(nodes);
    let copySteps = {};
    const nameIndex = {};   // {branch: 3}
    const keyToIndex = {};  // {'branch_1': 2}
    const idMap = {};

    const loop = (items) => {
        items.forEach(({ id, subNodes }) => {
            const key = id.split('.')[0];           // branch_1
            const name = key.replace(/_\d+$/, '');  // branch

            let newId;

            if (!keyToIndex[key]) {
                let i = nameIndex[name] || 1;
                while (allSteps[`${name}_${i}`] || copySteps[`${name}_${i}`] || originSteps[`${name}_${i}`]) {
                    i++;
                }
                newId = id.replace(key, `${name}_${i}`);
                keyToIndex[key] = i;
                nameIndex[name] = i + 1;
                copyNodes = copyNodes.replace(new RegExp(`"id":"${key}("|\\.)`, 'gm'), `"id":"${name}_${i}$1`);
            } else {
                newId = id.replace(key, `${name}_${keyToIndex[key]}`);
            }

            let stepObject = originSteps[id] || allSteps[id];

            if (stepObject) {
                stepObject = JSON.parse(JSON.stringify(stepObject));
                if (id !== newId) {
                    idMap[id] = newId;
                    stepObject.id = newId;
                    if (stepObject.type.startsWith('branch_') && stepObject.type.endsWith('_parent')) {
                        const branches = stepObject.input.branches.value;
                        Object.keys(branches).forEach((subId) => {
                            const _subId = subId.replace(id, newId)
                            branches[_subId] = {
                                ...branches[subId],
                                key: _subId
                            };
                            delete branches[subId];
                        });
                    }
                }
                copySteps[newId] = stepObject;
            }
            if (subNodes && subNodes.length) {
                loop(subNodes);
            }
        });
    }
    loop(nodes);

    // 替换复制节点中的关联节点id
    Object.values(copySteps).forEach((step) => {
        if (step.relation && step.relation.relatedId && idMap[step.relation.relatedId]) {
            step.relation.relatedId = idMap[step.relation.relatedId];
        }
    });

    // 替换入参中表达式的节点值
    copySteps = JSON.stringify(copySteps);
    Object.keys(idMap).forEach(oldId => {
        const newId = idMap[oldId];
        copySteps = copySteps.split(`_(\\"$.${oldId}.`).join(`_(\\"$.${newId}.`).split(`_(\\"$.${oldId}")`).join(`_(\\"$.${newId}")`);
    });

    return {
        nodes: JSON.parse(copyNodes),
        steps: JSON.parse(copySteps)
    }
}

/**获取常规组件详情 */
const getComponentDetail = async (tenantId, nodeConfig) => {
    // const { type, componentId, componentCode, componentVersion, } = nodeConfig;
    // const res = await post('/api/component/get', {
    //     componentId,
    // });
    // if (!res || res.errMsg) {
    //     return;
    // }
    // return res;
    // return mockSelectSearchConfig;
}

/**获取表单组件详情 */
const getFormComponentDetail = async (tenantId, nodeConfig) => {
    // const { type, componentId, componentCode, componentVersion, } = nodeConfig;
    // const res = await post('/api/component/getFormComponent', {
    //     tenantId,
    //     componentId,
    // });
    // if (!res || res.errMsg) {
    //     return;
    // }

    // return res;
}

/**根据操作入参配置，获取节点入参默认值 */
export const getInputValueFromInputConfig = (input = {}) => {

    let res = {};

    const loop = (property = {}, obj, addItem = true) => {
        for (const _key in property) {
            const { defaultDataType, defaultValue, element, properties, hidden, disabledExpression, disabledNull } = property[_key]
            let dataType = defaultDataType;
            // 当前表单数据类型-默认第一项
            let dataTypeRange = property[_key].dataTypeRange || {};
            if (!disabledExpression) {
                dataTypeRange[FORM_TYPE.expression] = FORM_TYPE.expression;
            }
            if (!disabledNull) {
                dataTypeRange[FORM_TYPE.null] = FORM_TYPE.null;
            }
            if (!dataTypeRange[dataType]) {
                Object.keys(dataTypeRange).forEach((valueType, index) => {
                    if (index === 0) {
                        dataType = valueType;
                    }
                })
            }

            let _value = defaultValue;

            if (!defaultValue) {
                _value = getInitValueByType(dataType);

                if (dataType === 'collection' && element) {
                    loop(element.properties || {}, _value, false);
                } else if (dataType === 'object' && properties) {
                    loop(properties, _value)
                }
            }

            const item = {
                key: _key,
                dataType: dataType,
                value: _value
            }

            if (addItem) {
                if (isArray(obj)) {
                    obj.push(item)
                } else {
                    obj[_key] = item
                }
            }

        }
    }
    loop(JSON.parse(JSON.stringify(input)), res);
    return res;
}

export const addNewNode = async ({
    tenantId,
    appId,
    origin,
    target,
    steps,
    structure,
    nodeConfig = {}
}) => {
    let newSteps = { ...steps };
    const newStructure = JSON.parse(JSON.stringify(structure));

    let node;
    let step;
    let id;
    const {
        componentId, componentCode,
        title, titleEn, description, descriptionEn,
        componentVersion, activityType,
    } = nodeConfig || {};

    let componentDetail;
    if (componentCode === 'form_helper') {
        componentDetail = await getFormComponentDetail(tenantId, nodeConfig);
    } else {
        componentDetail = await getComponentDetail(tenantId, nodeConfig);
    }

    const { groups = [] } = componentDetail || {};

    let defaultAction;
    if (groups.length) {
        if (groups[0].actions && groups[0].actions.length) {
            defaultAction = groups[0].actions[0]
        }
    }
    const {
        actionId, actionCode, input, hasCertificate, hideErrorHandle, hasRelation, hasListener, hideErrorHandleCondition, form,
    } = defaultAction || {};

    const inputValue = getInputValueFromInputConfig(input);

    let listenerValue;
    if (hasListener) {
        // listenerValue = getInputValueFromInputConfig(listenerFormConfig);
    }
    // console.log("addNewNode", origin, target, actionId, actionCode, inputValue)

    if (origin === 'branch') {
        id = getNewId(origin, newSteps);

        const normalSubSteps = [], normalStepChildConfig = {};
        Array.from({ length: BRANCH_MIN_COUNT[actionCode] }).forEach((_, index) => {
            const branchKey = `${id}${BRANCH_ID_INFIX}${index + 1}`;
            // 画布节点子结构
            normalSubSteps.push(getBranchSubStep(branchKey, actionCode));
            // 画布节点子类配置
            normalStepChildConfig[branchKey] = getBranchStepChildConfig(index + 1, branchKey, actionCode)
        })

        // 画布节点-入参
        const branchInputValues = getBranchInputValues(normalStepChildConfig)

        // 默认分支
        normalSubSteps.push({
            id: `${id}.default`,
            type: (SPECIAL_NODE_TYPE_MAP['branch'][actionCode] || {}).childDefault || "",
            subNodes: []
        })
        normalStepChildConfig[`${id}.default`] = {
            id: `${id}.default`,
            name: `Default`,
            type: (SPECIAL_NODE_TYPE_MAP['branch'][actionCode] || {}).childDefault || "",
        }

        node = {
            id: id,
            type: (SPECIAL_NODE_TYPE_MAP['branch'][actionCode] || {}).parent || "",
            subNodes: normalSubSteps
        };
        step = {
            [id]: {
                id: id,
                name: title,
                nameEn: titleEn,
                description: '',
                descriptionEn: '',
                type: (SPECIAL_NODE_TYPE_MAP['branch'][actionCode] || {}).parent || "",
                componentVersion: componentVersion,
                componentId: componentId,
                actionId: actionId,
                input: branchInputValues,
            },
            ...normalStepChildConfig,
        }
    } else if (origin === 'loop') {
        id = getNewId(origin, newSteps);
        node = {
            "id": id,
            "type": (SPECIAL_NODE_TYPE_MAP['loop'][actionCode] || {}).parent || "",
            "subNodes": [{
                "id": `${id}.default`,
                "type": (SPECIAL_NODE_TYPE_MAP['loop'][actionCode] || {}).childDefault || "",
                "subNodes": []
            }]
        };
        step = {
            [id]: {
                id: id,
                name: title,
                nameEn: titleEn,
                description: '',
                descriptionEn: '',
                type: (SPECIAL_NODE_TYPE_MAP['loop'][actionCode] || {}).parent || "",
                componentVersion: componentVersion,
                componentId: componentId,
                actionId: actionId,
                input: inputValue,
            },
            [`${id}.default`]: {
                id: `${id}.default`,
                name: "Default",
                type: (SPECIAL_NODE_TYPE_MAP['loop'][actionCode] || {}).childDefault || "",
            }
        };
    } else if (origin === 'while') {
        id = getNewId(origin, newSteps);
        node = {
            "id": id,
            "type": SPECIAL_NODE_TYPE_MAP['while'].parent,
            "subNodes": [{
                "id": `${id}.default`,
                "type": SPECIAL_NODE_TYPE_MAP['while'].childDefault,
                "subNodes": []
            }]
        };
        step = {
            [id]: {
                id: id,
                name: title,
                nameEn: titleEn,
                description: '',
                descriptionEn: '',
                type: SPECIAL_NODE_TYPE_MAP['while'].parent,
                componentVersion: componentVersion,
                componentId: componentId,
                actionId: actionId,
                input: inputValue,
            },
            [`${id}.default`]: {
                "id": `${id}.default`,
                "name": "Default",
                "type": SPECIAL_NODE_TYPE_MAP['while'].childDefault,
            },
        };
    } else {
        // 调接口获取详情
        id = getNewId(origin, newSteps);
        node = {
            "id": id,
            "type": activityType,
            "subNodes": null
        };
        step = {
            [id]: {
                id: id,
                name: title,
                nameEn: titleEn,
                description: '',
                descriptionEn: '',
                type: activityType,
                componentId: componentId,
                componentVersion: componentVersion,
                // actionId: actionId,
                input: inputValue
            }
        }
        // 表单组件
        if (componentCode === 'form_helper') {
            step[id].formConfig = {
                formId: "",
                formVersion: 0,
                formName: "",
                formNameEn: "",
                ...form
            };
        } else {
            step[id].actionId = actionId;
        }
        // 凭证
        if (hasCertificate) {
            step[id].certificate = {
                certificateId: ""
            }
        }
        // 错误处理
        if (!hideErrorHandle) {
            step[id].errorHandle = {
                "errorHandleStrategy": "terminate",
                "maxRetryTime": 0,
                "retryInterval": 1000
            }
            if (hideErrorHandleCondition) {
                step[id].errorHandle.condition = '';
            }
        }
        // 节点关联
        if (hasRelation) {
            step[id].relation = {
                relatedId: ""
            }
        }
        if (activityType === TYPE.GOTO) {
            step[id].relation = {
                relatedId: "",
                maxLoopSize: 1000
            }
        }
        // 节点监听
        if (hasListener) {
            step[id].nodeListener = listenerValue
        }

        if ([TYPE.DATA_SERVICE_HELPER, TYPE.DATASET_HELPER].includes(activityType)) {
            step[id].dataServiceConfigDTO = {
                appId: appId,
                dataServiceCode: '',
                dataServiceContractVersion: '',
                dataSetCode: '',
                dataSetVersion: '',
                dataSetMethodCode: '',
                async: false,
            }
        }
        // 缓存设置
        // if (hasActivityCache) {
        step[id].activityCache = {
            enable: false,
            scope: 1,
            expiredSeconds: 1,
        }
        // }
    };

    if (node && step) {
        const filter = (items) => {
            let i = 0;
            do {
                const item = items[i];
                const { id: nodeId, subNodes, type } = item;
                if (nodeId === target) {
                    // 选中了
                    if (
                        (type.startsWith('loop_') && (type.endsWith('_child') || type.endsWith('_default')))
                        || (type.startsWith('while_') && (type.endsWith('_child') || type.endsWith('_default')))
                        || (type.startsWith('branch_') && (type.endsWith('_child') || type.endsWith('_default')))
                    ) {
                        if (!item.subNodes) {
                            item.subNodes = [];
                        }
                        item.subNodes.unshift(node);
                    } else {
                        if (target.endsWith('.default')) {
                            // 往默认节点中添加
                            if (!item.subNodes) {
                                item.subNodes = [];
                            }
                            item.subNodes.push(node)
                        } else {
                            items.splice(i + 1, 0, node);
                        }
                    }
                    newSteps = { ...newSteps, ...step };

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
    }
    // console.log("=====add node====", id, newSteps, newStructure)
    return {
        id,
        steps: newSteps,
        structure: newStructure
    }
}

export const getNewId = (key, steps) => {
    let i = 1;
    while (steps[`${key}_${i}`]) {
        i++
    }

    return `${key}_${i}`;
}

export const addNewBranch = (target, steps, structure) => {
    const newSteps = JSON.parse(JSON.stringify(steps));
    const newStructure = JSON.parse(JSON.stringify(structure));

    const filter = (items) => {
        let i = 0;
        do {
            const item = items[i];
            const { id, subNodes, type } = item;
            if (id === target) {
                const branchValue = newSteps[id].input.branches.value;
                const existNames = [], existIds = [];
                let key;
                for (key in newSteps) {
                    if (key.startsWith(`${id}.`) && !key.endsWith(".default")) {
                        existNames.push(newSteps[key].name);
                        existIds.push(key);
                    }
                }

                // 确定child的id
                const childId = getBranchId(existIds, id);
                // 确定child的name
                const childName = getBranchName(existNames);

                let childType;
                if (type === TYPE.BRANCH_EXCLUSIVE_PARENT) {
                    childType = TYPE.BRANCH_EXCLUSIVE_CHILD;
                } else if (type === TYPE.BRANCH_PARALLEL_PARENT) {
                    childType = TYPE.BRANCH_PARALLEL_CHILD;
                } else {
                    childType = TYPE.BRANCH_INCLUSIVE_CHILD;
                }
                const node = {
                    "id": childId,
                    "type": childType,
                    "subNodes": []
                };

                // 并行网关添加到最后，其他添加到default前
                // 并行网关没条件
                if (type === TYPE.BRANCH_PARALLEL_PARENT) {
                    subNodes.splice(subNodes.length, 0, node);
                    branchValue[childId] = {
                        key: childId,
                        dataType: "object",
                        value: {}
                    }
                } else {
                    subNodes.splice(subNodes.length - 1, 0, node);
                    branchValue[childId] = {
                        key: childId,
                        dataType: "object",
                        value: {
                            branch_condition: {
                                key: "branch_condition",
                                dataType: 'expression',
                                value: ""
                            }
                        }
                    }
                }

                newSteps[childId] = {
                    "id": childId,
                    "type": childType,
                    "name": childName,
                };

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
    // console.log("newSteps", newSteps)
    // console.log("newStructure", newStructure)
    return {
        steps: newSteps,
        structure: newStructure
    }
}

export const findNodeById = (id, list = [], cd = () => { }) => {
    let found = false;
    const loop = (list) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                found = true;
                cd(list[i])
                return;
            }

            if (!found && list[i].subNodes && list[i].subNodes.length) {
                loop(list[i].subNodes)
            }

            if (found) {
                return;
            }

        }
    }
    loop(list)
}
