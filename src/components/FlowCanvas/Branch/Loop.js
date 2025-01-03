import React, { useCallback } from 'react';
import { Container, Graphics } from '@pixi/react';

import { SPACE, BRANCH, COLOR, ELEMENT } from '../constant';
import Line from '../Line';

const Loop = ({ width, height, y = 0, children, id, selected = false, branchId, firstChildId }) => {
    const linedraw = useCallback((g) => {
        const color = selected ? COLOR.BLUE : COLOR.GRAY;
        // 总宽度为子容器宽度加上360左边距
        // 右边起始点为子容器宽度一半加上360左边距
        const startX = (SPACE + width) / 2;
        const rightX = width / 2 + SPACE;
        let toY = 0;
        g.clear();
        g.lineStyle(2, color, 1);
        g.moveTo(startX, toY);

        toY += BRANCH.TOP_LINE_HEIGHT;  // 40px竖线
        g.lineTo(startX, toY);

        g.arc(startX + BRANCH.RADIUS, toY, BRANCH.RADIUS, 1 * Math.PI, -1.5 * Math.PI);

        toY += BRANCH.RADIUS;  // 15px弧线
        g.lineTo(rightX - BRANCH.RADIUS, toY);

        toY += BRANCH.RADIUS; // 15px弧线
        g.arc(rightX - BRANCH.RADIUS, toY, BRANCH.RADIUS, 1.5 * Math.PI, 2 * Math.PI);

        toY += height ? BRANCH.SHORT_ADD_HEIGHT : BRANCH.LONG_ADD_HEIGHT;   // 子路径顶部“添加”高度
        toY += height; // 子路径高度
        g.moveTo(rightX, toY);

        g.arc(rightX - BRANCH.RADIUS, toY, BRANCH.RADIUS, 0 * Math.PI, 0.5 * Math.PI);

        toY += BRANCH.RADIUS;
        g.lineTo(0 + BRANCH.RADIUS, toY);

        toY -= BRANCH.RADIUS;
        g.arc(0 + BRANCH.RADIUS, toY, BRANCH.RADIUS, 0.5 * Math.PI, 1 * Math.PI);

        toY = BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 2; // 回到左上角
        g.lineTo(0, toY);

        g.arc(0 + BRANCH.RADIUS, toY, BRANCH.RADIUS, 1 * Math.PI, 1.5 * Math.PI);

        toY -= BRANCH.RADIUS;
        g.lineTo(startX, toY);
        g.endFill();

        // 三角箭头
        g.beginFill(color);
        g.moveTo(startX, toY);
        g.lineTo(startX - 8, toY - 3);
        g.lineTo(startX - 8, toY + 3);
        g.lineTo(startX, toY);
        g.endFill();
    }, [width, height, selected]);

    const hasChildren = children && children.length > 0;

    return (
        <Container position={[0 - (SPACE + width) / 2, y]} _id={id} _type={ELEMENT.SUBCONTAINER}>
            <Graphics draw={linedraw} />
            
            {
                hasChildren ? (
                    <Container position={[width / 2 + SPACE, BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 2 + BRANCH.SHORT_ADD_HEIGHT]}>
                        {children}
                    </Container>
                ) : null
            }
            <Line
                x={width / 2 + SPACE}
                y={BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 2}
                size={hasChildren ? BRANCH.SHORT_ADD_HEIGHT : BRANCH.LONG_ADD_HEIGHT}
                showArrow={hasChildren}
                selected={selected}
                prev={branchId}
                next={firstChildId}
            />
        </Container>
    )
}

export default Loop;