import React, { useEffect } from 'react';
import { PrefixCls } from '../../../../constants';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import hljs from 'highlight.js';
import './code.scss';
import './index.scss';
interface MessageProps {
    data: string;
    showCite?: boolean;
}

export default (props: MessageProps) => {
    const {
        data: propsMsg,
        showCite: propsShowCite = false,
    } = props;
    useEffect(() => {
        hljs.configure({
            ignoreUnescapedHTML: true,
        });
        // 获取到内容中所有的code标签
        const codes = document.querySelectorAll('.trippal-message-mark-down-body .code_wrapper code');
        codes.forEach((el) => {
            // 让code进行高亮
            hljs.highlightElement(el as HTMLElement);
        });
    }, []);
    return !propsShowCite ? <div className={`${PrefixCls}-mark-down-body`}>
        <ReactMarkdown
            children={propsMsg}
            remarkPlugins={[gfm]}
            components={{
                code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    // inline是否是行内;
                    return !inline && match ? (
                        <div className="code_wrapper">
                            <code className={className}>
                                {children}
                            </code>
                        </div>
                    ) : (
                        <code>
                            {children}
                        </code>
                    );
                },
            }}
        /> </div> : <span className={`${PrefixCls}-mark-cite-body`}>[MarkDown]</span>;
};
