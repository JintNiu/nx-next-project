import React, { useCallback, useEffect, useState } from 'react';
import { Container, Graphics } from '@pixi/react';
// import { Spring } from 'react-spring';
// import { Graphics as AnimateGraphics } from '@pixi/react-animated';

import { COLOR, ELEMENT, LINE } from '../constant';
import { useEditing } from '../context';

const Line = ({
    x,
    y,
    showArrow,
    placement="middle",
    size,
    children,
    selected = false,
    prev='',
    next='',
    end,
}) => {
    // const [addProps, setAddProps] = useState({
    //     scale: 1
    // });

    const editing = useEditing();
    // const overAddId = useOverAddId();

    // 线条
    const lineDraw = useCallback((g) => {
        let y = showArrow ? size - 2 : size;
        const color = selected ? COLOR.BLUE : COLOR.GRAY;
        g.clear();
        g.lineStyle(2, color, 1);
        g.lineTo(0, y);
        g.endFill();

        y++;
        if (showArrow) {
            // 三角箭头
            g.lineStyle(1, color, 1);
            g.beginFill(color);
            g.moveTo(0, y);
            g.lineTo(-3, y - 8);
            g.lineTo(3, y - 8);
            g.lineTo(0, y);
            g.endFill();
        }

        if (end) {
            g.lineStyle(3, COLOR.END);
            g.moveTo(-10, 6);
            g.lineTo(10, 15);
            g.endFill();
        }
    }, [size, showArrow, selected, end]);

    // 增加按钮
    const addDraw = useCallback((g) => {
        g.clear();
        g.beginFill(COLOR.GRAY);
        g.lineStyle(2, COLOR.BACKGROUND, 1);
        g.drawRoundedRect(0, 0, LINE.ADD_BUTTON_SIZE, LINE.ADD_BUTTON_SIZE, LINE.ADD_BUTTON_RADIUS);
        g.endFill();
        // 十字线条
        g.lineStyle(1, 0xFFFFFF, 1);
        g.moveTo(4, LINE.ADD_BUTTON_SIZE / 2);
        g.lineTo(LINE.ADD_BUTTON_SIZE - 4, LINE.ADD_BUTTON_SIZE / 2);
        g.moveTo(LINE.ADD_BUTTON_SIZE / 2, 4);
        g.lineTo(LINE.ADD_BUTTON_SIZE / 2, LINE.ADD_BUTTON_SIZE - 4);
        g.endFill();
    }, []);

    // useEffect(() => {
    //     if (overAddId === prev) {
    //         if (addProps.scale !== 1.18) {
    //             setAddProps({
    //                 scale: 1.18
    //             });
    //         }
    //     } else {
    //         if (addProps.scale !== 1) {
    //             setAddProps({
    //                 scale: 1
    //             });
    //         }
    //     }
    // }, [overAddId, prev]);

    return (
        <Container position={[x, y]}>
            <Graphics draw={lineDraw} />
            {
                // 折叠按钮
                children
            }
            {
                editing ? (
                    <Container
                        eventMode="static"
                        position={[0, placement === 'bottom' ? size - 3 : size / 2]}
                        _prev={prev}
                        _next={next}
                        _type={ELEMENT.ADDNODE}
                    >
                        <Graphics draw={addDraw} pivot={{x: LINE.ADD_BUTTON_SIZE / 2, y: LINE.ADD_BUTTON_SIZE / 2}} />
                        {/* <Spring native to={addProps} >
                            {(props) => (
                                <AnimateGraphics
                                    draw={addDraw}
                                    pivot={{x: LINE.ADD_BUTTON_SIZE / 2, y: LINE.ADD_BUTTON_SIZE / 2}}
                                    {...props}
                                />
                            )}
                        </Spring> */}
                    </Container>
                ) : null
            }
        </Container>
    )
}

export default Line;