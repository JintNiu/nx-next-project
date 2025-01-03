export const NODE = {
    WIDTH: 60,
    HEIGHT: 60,
    RADIUS: 10,
}

export const LINE = {
    SHORT_SIZE: 35,
    LANG_SIZE: 55,
    ADD_BUTTON_SIZE: 14,
    ADD_BUTTON_RADIUS: 4,
    DROP_RADIUS: 8,
    DROP_MAX_SIZE: 32
}

export const BRANCH = {
    RADIUS: 15,
    LONG_ADD_HEIGHT: 90,
    SHORT_ADD_HEIGHT: 45,
    TOP_LINE_HEIGHT: 45,
    NAME_HEIGHT: 18,
    NAME_SIZE: 12,
    NAME_PADDING_TOP: 10,
    ADD_BRANCH_WIDTH: 60,
    ADD_BRANCH_MARGIN_BOTTOM: 0,
    ADD_BRANCH_RADIUS: 4,
    FOLDER_SIZE: 14,
    FOLDER_NUM_SIZE: 4,
}

export const COLOR = {
    GRAY: 0xC7CCDF,
    BLUE: 0x3288FF,
    BLUE03: 0xABCDFC,
    BLUE02: 0xE3ECFD,
    RED: 0xFBBEBC,
    BACKGROUND: 0xF1F3F8,
    WHITE: 0xFFFFFF,
    END: 0xF5222D,
}

export const TYPE = {
    // 排他网关
    BRANCH_EXCLUSIVE: "branch_exclusive",
    BRANCH_EXCLUSIVE_PARENT: 'branch_exclusive_parent',
    BRANCH_EXCLUSIVE_CHILD: 'branch_exclusive_child',
    BRANCH_EXCLUSIVE_CHILD_DEFAULT: 'branch_exclusive_child_default',
    // 并行网关
    BRANCH_PARALLEL: 'branch_parallel',
    BRANCH_PARALLEL_PARENT: 'branch_parallel_parent',
    BRANCH_PARALLEL_CHILD: 'branch_parallel_child',
    BRANCH_PARALLEL_CHILD_DEFAULT: 'branch_parallel_child_default',
    // 包含网关
    BRANCH_INCLUSIVE: 'branch_inclusive',
    BRANCH_INCLUSIVE_PARENT: 'branch_inclusive_parent',
    BRANCH_INCLUSIVE_CHILD: 'branch_inclusive_child',
    BRANCH_INCLUSIVE_CHILD_DEFAULT: 'branch_inclusive_child_default',
    LOOP_SERIAL: 'loop_serial',
    LOOP_SERIAL_PARENT: 'loop_serial_parent',
    LOOP_SERIAL_CHILD_DEFAULT: 'loop_serial_child_default',
    LOOP_PARALLEL: 'loop_parallel',
    LOOP_PARALLEL_PARENT: 'loop_parallel_parent',
    LOOP_PARALLEL_CHILD_DEFAULT: 'loop_parallel_child_default',
    WHILE_PARENT: 'while_parent',
    WHILE_CHILD_DEFAULT: 'while_child_default',
    TRIGGER: 'trigger',
    GOTO: 'goto',
    NORMAL: 'normal',
    ACTIVE: 'active',
    ERROR: 'error',
    DEFAULT: 'default',
    // 复合组件
    COMPOSE: "compose",
    COMPOSE_OUTPUT: 'compose_output',
    COMPOSE_INPUT: 'compose_input',
    // 数据服务
    DATA_SERVICE: 'data_service',
    DATA_SERVICE_OUTPUT: 'data_service_output',
    DATA_SERVICE_HELPER: 'data_service_helper',
    DATASET_HELPER: 'dataset_helper'
}

export const ELEMENT = {
    NODE: 'node',
    ADDNODE: 'addNode',
    FOLDER: 'folder',
    ADDBRANCH: 'addBranch',
    SUBCONTAINER: 'SubContainer',
    SELECTOR: 'selector',
}

export const PATHCONNECTOR = '|';

export const SPACE = 360;

export const SELECTOR = {
    PADDING: 30,
    RADIUS: 15
}

export const ACTION = {
    MOVE: 'move',
    ADD: 'add',
    CUT: 'cut',
    COPY: 'copy'
}

export const GOTO = {
    LEFT: 30,
    TOP: 25,
    RADIUS: 8
}

export const BRANCH_NAME_PREFIX = 'Branch ';
export const BRANCH_ID_INFIX = '.child_';

export const BRANCH_MIN_COUNT = {
    [TYPE.BRANCH_EXCLUSIVE]: 1,
    [TYPE.BRANCH_PARALLEL]: 2,
    [TYPE.BRANCH_INCLUSIVE]: 2,
}


/**分支，循环 steps和structure type枚举 */
export const SPECIAL_NODE_TYPE_MAP = {
    branch: {
        [TYPE.BRANCH_EXCLUSIVE]: {
            parent: TYPE.BRANCH_EXCLUSIVE_PARENT,
            child: TYPE.BRANCH_EXCLUSIVE_CHILD,
            childDefault: TYPE.BRANCH_EXCLUSIVE_CHILD_DEFAULT,
        },
        [TYPE.BRANCH_PARALLEL]: {
            parent: TYPE.BRANCH_PARALLEL_PARENT,
            child: TYPE.BRANCH_PARALLEL_CHILD,
            childDefault: TYPE.BRANCH_PARALLEL_CHILD_DEFAULT,
        },
        [TYPE.BRANCH_INCLUSIVE]: {
            parent: TYPE.BRANCH_INCLUSIVE_PARENT,
            child: TYPE.BRANCH_INCLUSIVE_CHILD,
            childDefault: TYPE.BRANCH_INCLUSIVE_CHILD_DEFAULT,
        }
    },
    loop: {
        [TYPE.LOOP_PARALLEL]: {
            parent: TYPE.LOOP_PARALLEL_PARENT,
            childDefault: TYPE.LOOP_PARALLEL_CHILD_DEFAULT,
        },
        [TYPE.LOOP_SERIAL]: {
            parent: TYPE.LOOP_SERIAL_PARENT,
            childDefault: TYPE.LOOP_SERIAL_CHILD_DEFAULT,
        }
    },
    while: {
        parent: TYPE.WHILE_PARENT,
        childDefault: TYPE.WHILE_CHILD_DEFAULT,
    }
}
export const FORM_TYPE = {
    input: 'input',
    select: 'select',
    selectSearch: 'selectSearch',
    inputNumber: 'inputNumber',
    datetime: 'datetime',
    switch: 'switch',
    javascript: 'javascript',
    list: 'list',
    object: 'object',
    dynamicList: 'dynamicList',
    dynamicObject: 'dynamicObject',
    expression: 'expression',
    null: 'null',
}

/**动态表单数据类型 */
export const VALUE_TYPE = {
    string: "string",
    number: "number",
    boolean: "boolean",
    date: "date",
    collection: "collection",
    object: "object",
    null: "null",
    expression: "expression",
    cron: 'cron',
    javascript: 'javascript',
}