import { LotteryData } from "@/app/tool/lottery/data";
import { Tag } from "antd";
import { memo } from "react";

import './index.scss';

export type TagListType = {
    list: LotteryData[];
    color?: string;
    onClose?: Function;
    onCheck?: Function;
};


const TagList = ({ list = [], color = "green", onCheck, onClose }: TagListType) => {
    return <>
        {
            list.map((item) => {
                return (
                    <Tag
                        key={item.name}
                        className="tag-item"
                        color={color}
                        closable={!!onClose}
                        style={{ cursor: !!onCheck ? "pointer" : "unset" }}
                        onClose={(e) => {
                            e.preventDefault();
                            onClose?.(item);
                        }}
                        onClick={() => {
                            onCheck?.(item);
                        }}
                    >
                        {item.name}
                    </Tag>
                );
            })
        }
    </>
};

export default memo(TagList)