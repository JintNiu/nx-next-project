export const isObject = (source) => {
    return Object.prototype.toString.call(source) === '[object Object]';
};

/**判断对象是否为空 */
export const isEmptyObject = (e) => {
    if (!e) {
        return true;
    }
    let t;
    for (t in e)
        return false;
    return true;
};

/**
 * @description 复制对象或数组（深拷贝）
 * @param {*} obj 源数据
 * @return {*}
 */
export const deepCloneObj = (obj) => {
    if (!obj && typeof obj !== 'object') {
        return;
    }
    let newObj = obj.constructor === Array ? [] : {};
    for (let key in obj) {
        if (typeof obj[key] === 'boolean') {
            newObj[key] = obj[key];
        }
        // if (obj[key]) {
        if (obj[key] && typeof obj[key] === 'object') {
            newObj[key] = obj[key].constructor === Array ? [] : {};
            // 递归
            newObj[key] = deepCloneObj(obj[key]);
        } else {
            newObj[key] = obj[key];
        }
        // }
    }
    return newObj;
};