import React, { useCallback, useState, useEffect } from 'react';
import { Container, Text, Graphics } from '@pixi/react';

import { COLOR, BRANCH, ELEMENT } from '../constant';

const Folder = ({ id, x, y, folded=false, number=0 }) => {
    const [color, setColor] = useState(COLOR.GRAY);
    const [width, setWidth] = useState(BRANCH.FOLDER_SIZE);

    useEffect(() => {
        if (folded) {
            setWidth(('' + number).length * BRANCH.FOLDER_NUM_SIZE + BRANCH.FOLDER_SIZE);
            setColor(COLOR.BLUE);
        } else {
            setWidth(BRANCH.FOLDER_SIZE);
            setColor(COLOR.GRAY);
        }
    }, [number, folded]);

    // 增加按钮
    const draw = useCallback((g) => {
        const { FOLDER_SIZE } = BRANCH;
        g.clear();
        
        g.beginFill(COLOR.BACKGROUND);
        g.lineStyle(2, COLOR.BACKGROUND, 1);
        g.drawRoundedRect(-1, -1, width + 2, FOLDER_SIZE + 2, FOLDER_SIZE + 2);
        g.endFill();

        g.lineStyle(1, color, 1);
        g.drawRoundedRect(0, 0, width, FOLDER_SIZE, FOLDER_SIZE);
        g.endFill();

        if (!folded) {
            g.moveTo(4, FOLDER_SIZE - 5);
            g.lineStyle(1, color, 1);
            g.lineTo(FOLDER_SIZE / 2, 5);
            g.lineTo(FOLDER_SIZE - 4, FOLDER_SIZE - 5);
            g.endFill();
        }
    }, [color, width, folded]);

    // const onOver = () => {
    //     setColor(COLOR.BLUE);
    // }
    // const onOut = () => {
    //     setColor(folded ? COLOR.BLUE : COLOR.GRAY);
    // }

    return (
        <Container position={[x, y + 5]} >
            <Graphics 
                draw={draw} 
                x={0 - width / 2} 
                y={0}
                eventMode="static" 
                // onpointerover={onOver}
                // onpointerout={onOut}
                _type={ELEMENT.FOLDER}
                _id={id}
                _number={number}
                _folded={folded}
            />
            {
                folded && (
                    <Text
                        text={number}
                        x={0}
                        y={0}
                        style={
                            {
                                fontSize: BRANCH.NAME_SIZE,
                                fill: [color], // gradient
                                lineHeight: BRANCH.FOLDER_SIZE
                            }
                        }
                        anchor={{x: 0.5, y: 0}}
                    />
                )
            }
        </Container>
        
    )
}

export default Folder;