import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { PrefixCls } from '../../constants';
import './index.scss';
interface ToastProps {
    content: string;
    show: boolean;
    close?: any;
}
export default (props: ToastProps) => {
    const {
        content: propsContent = '',
        show: propsShow = false,
        close: propsClose,
    } = props;
    const toastRef = useRef<any>(null);
    const duration = 800; // 默认toast消失的时间

    const getMaxZIndex = () => {
        let domList: any = document.querySelectorAll("*");
        domList = Array.from(domList); // 需要将dom数组转换成数组才可以进行map
        let arr = domList.map((e: any) => {
            let returnNumber = +window.getComputedStyle(e).zIndex || 0;
            return returnNumber
        });
        return arr.length ? Math.max(...arr) : 0;
    };
    const ToastContent = useCallback((curProps: {
        content: string,
    }) => {
        const {
            content: showContent,
        } = curProps;
        return <div className={`${PrefixCls}-toast-content`}>{showContent}</div>;
    }, [propsShow]);
    const creatToast = () => {
        const maxIndex = getMaxZIndex();
        let parentDom = document.querySelector('body') as HTMLElement; // 默认追加到父容器里面
        const div = document.createElement('div'); // 创建div标签
        div.className = `${PrefixCls}-toast-wrapper`;
        div.style.zIndex = `${maxIndex}`;
        parentDom.appendChild(div); // 挂在到parentDom上
        toastRef.current = ReactDOM.render(<ToastContent content={propsContent} />, div);
        return {
            destroy() {
                parentDom.removeChild(div);
                // toastRef 删除
                if (toastRef.current) {
                    toastRef.current = null;
                }
            },
        };
    };
    useEffect(() => {
        let curToast: any;
        if (propsShow) {
            // 创建div标签
            curToast = creatToast();
            setTimeout(() => {
                curToast.destroy();
                propsClose();
            }, duration);
        }
    }, [propsShow]);
    return <></>;
};
