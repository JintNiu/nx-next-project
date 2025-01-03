import React from 'react';

import { Spin } from 'antd';

import './index.scss';

export default ({ image, onClick }) => {

    const handleClick = (e) => {
        const target = e.target;
        const rect = target.getBoundingClientRect();
        const { width: miniWidth, height: miniHeight, x, y } = rect;
        const { width, height } = image;
        const diffX = e.clientX - x;
        const diffY = e.clientY - y;

        width * (miniWidth / 2 - diffX) / miniWidth

        onClick(width * (miniWidth / 2 - diffX) / miniWidth, height * diffY / miniHeight);
    }

    return (
        <div className="flow-minimap-view" style={{width: 250, height: 350}}>
            {
                image ? (
                    <img src={image.src} onClick={handleClick}/>
                ) : <Spin />
            }
        </div>
    )
}