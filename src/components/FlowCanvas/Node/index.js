import React, { useCallback, useMemo } from 'react';
import { Container, Text, Graphics } from '@pixi/react';
import { Texture, BaseTexture, Rectangle } from 'pixi.js';

import { NODE, COLOR, TYPE, ELEMENT } from '../constant';

const Node = ({ image, x, y, type = "default", title, id, path, subListIds = [], nodeType }) => {
    const texture = useMemo(() => {
        if (image) {
            const baseTexture = BaseTexture.from(image);
            baseTexture.setSize(NODE.WIDTH, NODE.HEIGHT);
            const texture = new Texture(baseTexture, new Rectangle(0, 0, NODE.WIDTH, NODE.HEIGHT));
            return texture;
        } else {
            return Texture.WHITE;
        }
    }, [image])

    /**
     * 节点外边框图样
     */
    const linedraw = useCallback((g) => {
        g.clear();
        if (type === TYPE.ACTIVE) {
            g.lineStyle(2, COLOR.BLUE, 1);
        } else if (type === TYPE.ERROR) {
            g.lineStyle(2, COLOR.RED, 1);
        } else {
            g.lineStyle(1, COLOR.GRAY, 1);
        }
        if (texture.baseTexture && texture.baseTexture.setSize) {
            texture.baseTexture.setSize(NODE.WIDTH, NODE.HEIGHT);
        }
        g.beginTextureFill({
            texture
        });
        g.drawRoundedRect(0, 0, NODE.WIDTH, NODE.HEIGHT, NODE.RADIUS);
        g.endFill();
    }, [type, texture]);

    return (
        <Container position={[x - NODE.WIDTH / 2, y]}>
            <Graphics
                draw={linedraw}
                eventMode="static"
                _id={id}
                _type={ELEMENT.NODE}
                _path={path}
                _subListIds={subListIds}
                _nodeType={nodeType}
                _image={image}
            />

            {
                title && (
                    <Text
                        text={title}
                        x={NODE.WIDTH + 10}
                        y={10}
                        style={
                            {
                                fontSize: 14,
                                fontWeight: 600,
                                fill: ['#070707'], // gradient
                                wordWrap: true,
                                wordWrapWidth: 400,
                            }
                        }
                    />
                )
            }
            {
                id && (
                    <Text
                        text={id}
                        x={NODE.WIDTH + 10}
                        y={35}
                        style={
                            {
                                fontSize: 12,
                                fill: ['#787F86'], // gradient
                                wordWrap: true,
                                wordWrapWidth: 400,
                            }
                        }
                    />
                )
            }
        </Container>
    )
}

export default Node;