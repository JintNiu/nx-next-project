import React, { useCallback, useState, useEffect } from 'react';
import { Container, Text, Graphics } from '@pixi/react';

import { SPACE, BRANCH, COLOR, ELEMENT } from '../constant';
import Line from '../Line';

import { getI18n } from '@/utils/i18n';
import { useEditing } from '../context';

const SHARK = {
    branch: getI18n('label_branch', 'Branch'),
}

const Branch = ({ width, height, y = 0, children, id, selected = false }) => {
    const editing = useEditing();

    const [totalWidth, setTotalWidth] = useState(width.reduce((prev, curr) => prev + curr) + (width.length - 1) * SPACE);

    useEffect(() => {
        setTotalWidth(width.reduce((prev, curr) => prev + curr) + (width.length - 1) * SPACE);
    }, [width, height]);

    const lineDraw = useCallback((g) => {
        const color = selected ? COLOR.BLUE : COLOR.GRAY;
        const maxHeight = Math.max(...height);
        const startX = totalWidth / 2;   // 中心 X
        const { RADIUS, TOP_LINE_HEIGHT, NAME_PADDING_TOP } = BRANCH;
        let toY = 0;

        g.clear();
        g.lineStyle(2, color, 1);
        g.moveTo(startX, 0);

        toY = TOP_LINE_HEIGHT;
        g.lineTo(startX, toY);

        g.arc(startX + RADIUS, toY, RADIUS, 1 * Math.PI, -1.5 * Math.PI);

        g.moveTo(startX, toY);
        g.arc(startX - RADIUS, toY, RADIUS, 0 * Math.PI, 0.5 * Math.PI);

        toY = TOP_LINE_HEIGHT + RADIUS * 2 + NAME_PADDING_TOP + maxHeight + RADIUS * 2;
        g.moveTo(startX, toY);
        g.arc(startX + RADIUS, toY, RADIUS, 1 * Math.PI, 1.5 * Math.PI);
        g.moveTo(startX - RADIUS, toY - RADIUS);
        g.arc(startX - RADIUS, toY, RADIUS, 1.5 * Math.PI, 0 * Math.PI);

        let leftX = 0;
        width.forEach((w, i) => {
            if (i > 0) {
                leftX += SPACE;
            }
            const itemX = leftX + w / 2;
            // 高度补线
            toY = TOP_LINE_HEIGHT + RADIUS * 2 + NAME_PADDING_TOP + height[i];
            g.moveTo(itemX, toY);
            toY = TOP_LINE_HEIGHT + RADIUS * 2 + NAME_PADDING_TOP + maxHeight;
            g.lineTo(itemX, toY);

            if (itemX < startX) {
                // 顶部连线
                toY = TOP_LINE_HEIGHT + RADIUS * 2 + NAME_PADDING_TOP;
                g.moveTo(itemX, toY);
                toY -= NAME_PADDING_TOP;
                g.lineTo(itemX, toY);

                g.arc(itemX + RADIUS, toY, RADIUS, 1 * Math.PI, 1.5 * Math.PI);

                toY -= RADIUS;
                g.lineTo(startX - RADIUS, toY);
                // 底部连线
                toY = TOP_LINE_HEIGHT + RADIUS * 2 + NAME_PADDING_TOP + maxHeight;
                g.moveTo(itemX, toY);
                g.arc(itemX + RADIUS, toY, RADIUS, 1 * Math.PI, -1.5 * Math.PI);
                toY += RADIUS;
                g.lineTo(startX - RADIUS, toY);
            } else if (itemX === startX) {
                // 顶部连线
                toY = TOP_LINE_HEIGHT;
                g.moveTo(startX, toY);
                toY += RADIUS * 2 + NAME_PADDING_TOP;
                g.lineTo(startX, toY);
                // 底部连线
                toY += maxHeight;
                g.moveTo(startX, toY);
                toY += RADIUS * 2;
                g.lineTo(startX, toY);
            } else {
                // 顶部连线
                toY = TOP_LINE_HEIGHT + RADIUS;
                g.moveTo(startX + RADIUS, toY);
                g.lineTo(itemX - RADIUS, toY);

                toY += RADIUS;
                g.arc(itemX - RADIUS, toY, RADIUS, 1.5 * Math.PI, 0 * Math.PI);

                toY += NAME_PADDING_TOP;
                g.lineTo(itemX, toY);
                // 底部连线
                toY += maxHeight;
                g.moveTo(itemX, toY);
                g.arc(itemX - RADIUS, toY, RADIUS, 0 * Math.PI, 0.5 * Math.PI);
                toY += RADIUS;
                g.lineTo(startX + RADIUS, toY);
            }

            leftX += w;
        });
        g.endFill();
    }, [width, height, totalWidth, selected]);

    const addBranchDraw = useCallback((g) => {
        g.clear();
        if (!editing) {
            return;
        }
        const startX = (totalWidth - BRANCH.ADD_BRANCH_WIDTH) / 2;
        g.beginFill(COLOR.GRAY);
        g.drawRoundedRect(
            startX,
            BRANCH.TOP_LINE_HEIGHT - BRANCH.ADD_BRANCH_MARGIN_BOTTOM - BRANCH.NAME_HEIGHT,
            BRANCH.ADD_BRANCH_WIDTH,
            BRANCH.NAME_HEIGHT,
            BRANCH.ADD_BRANCH_RADIUS
        );
        g.endFill();
    }, [editing, totalWidth]);

    return (
        <Container position={[0 - totalWidth / 2, y]} _id={id} _type={ELEMENT.SUBCONTAINER} >
            <Graphics draw={lineDraw} />
            {
                editing && (
                    <>
                        <Graphics
                            draw={addBranchDraw}
                            eventMode="static"
                            _type={ELEMENT.ADDBRANCH}
                            _id={id}
                        />
                        <Text
                            text={`+ ${SHARK.branch}`}
                            x={totalWidth / 2}
                            y={BRANCH.TOP_LINE_HEIGHT - BRANCH.ADD_BRANCH_MARGIN_BOTTOM - BRANCH.NAME_HEIGHT}
                            anchor={{ x: 0.5, y: 0 }}
                            style={
                                {
                                    fontSize: BRANCH.NAME_SIZE,
                                    fill: ['#FFFFFF'], // gradient
                                    lineHeight: BRANCH.NAME_HEIGHT
                                }
                            }
                        />
                    </>
                )
            }

            <Container position={[0, BRANCH.TOP_LINE_HEIGHT + BRANCH.RADIUS * 2 + BRANCH.NAME_PADDING_TOP]} >{children}</Container>
        </Container>
    )
}

Branch.Item = ({ name, x, children, width, selected = false, branchId, firstChildId }) => {
    const hasChildren = children && children.length > 0;

    /**
     * position是以中心点为起始点的，需要将起始点移到最左边
     */
    return (
        <Container position={[x + width / 2, 0]}>
            <Text
                text={name}
                x={0}
                y={0}
                anchor={{ x: 0.5, y: 0 }}
                style={
                    {
                        fontSize: BRANCH.NAME_SIZE,
                        fill: ['#787F86'], // gradient
                        wordWrap: true,
                        wordWrapWidth: 400,
                        lineHeight: BRANCH.NAME_HEIGHT
                    }
                }
            />
            {
                hasChildren && (
                    <Container position={[0, BRANCH.SHORT_ADD_HEIGHT + BRANCH.NAME_HEIGHT]} >{children}</Container>
                )
            }
            <Line
                x={0}
                y={BRANCH.NAME_HEIGHT}
                size={hasChildren ? BRANCH.SHORT_ADD_HEIGHT : BRANCH.LONG_ADD_HEIGHT}
                showArrow={hasChildren}
                selected={selected}
                prev={branchId}
                next={firstChildId}
            />
        </Container>
    )
}

export default Branch;