import { Card } from "antd";
import { memo } from "react"
import TagList, { TagListType } from "../TagList";
import './index.scss';
type TagListCardType = TagListType & {
    title: string,
};

const TagListCard = ({ title, ...tagListProps }: TagListCardType) => {
    return <Card title={title} className="tag-list-card">
        <TagList {...tagListProps} />
    </Card>
}
export default memo(TagListCard);