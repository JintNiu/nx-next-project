export const isArray = (source) => {
    if (Array.isArray) return Array.isArray(source);
    else return source instanceof Array;
};
/**
 * @desc: 根据固定顺序的数组进行排序
 * @param {Array}  array 原数组
 * @param {String} sortList 排序数组
 * @param {String} key 数组属性
 * @return {Array}
 */
export const sortArrayBySortList = (array, sortList, key) => {
    if (!array || array.length === 0 || !sortList || sortList.length === 0) {
        return array;
    }

    if (!key || !Object.prototype.hasOwnProperty.call(array[0], key)) {
        array.sort((prev, next) => {
            return sortList.indexOf(prev) - sortList.indexOf(next);
        });
        return array;
    }

    array.sort((prev, next) => {
        return sortList.indexOf(prev[key]) - sortList.indexOf(next[key]);
    });
    return array;
};

// 已知Object数组里，插入新元素：
// 1，4，5==》3
// 1，4，5，3==》6
// 1，2，5==》3
// 1，4，5，3，9==》6
//
// 1，根据当前数组length生成新元素，如数组里不存在，则直接插入。
// 2，如果存在，自增后继续在数组里找，
export const getUniqueKeyFromList = ({ list = [], prefix = '', listFieldName, ignoreZero }) => {
    let targetIndex = ignoreZero ? 1 : 0;
    while (list.some(item => (listFieldName ? item[listFieldName] : item) === `${prefix}${targetIndex}`)) {
        targetIndex++;
    }
    return `${prefix}${targetIndex}`;
}

export const swapArrayItem = (arr, currentIndex, targetIndex) => {
    arr[currentIndex] = arr.splice(targetIndex, 1, arr[currentIndex])[0];
    return arr;
};


export const getRandomKeyFromList = ({ list = [], prefix = '', listFieldName }) => {
    let targetIndex = window.btoa(new Date().getTime() + '_' + parseInt(Math.random(0, 1) * 10000)).substring(15);
    while (list.some(item => (listFieldName ? item[listFieldName] : item) === `${prefix}${targetIndex}`)) {
        targetIndex = window.btoa(new Date().getTime() + '_' + parseInt(Math.random(0, 1) * 10000)).substring(15);
    }
    return `${prefix}${targetIndex}`;
}


export const sortArray = (arr, field, sort) => {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
        if (i === Math.floor(arr.length / 2)) {
            continue;
        }
        if (arr[i][field] < pivot[field]) {

            if (sort === 'ascend') {
                left.push(arr[i]);
            } else if (sort === 'descend') {
                right.push(arr[i]);
            }
        } else {
            if (sort === 'ascend') {
                right.push(arr[i]);
            } else if (sort === 'descend') {
                left.push(arr[i]);
            }
        }
    }

    return [...sortArray(left, field, sort), pivot, ...sortArray(right, field, sort)];
}