import React, { useCallback } from 'react';
import './index.scss';
interface iconProps {
    type: string;
    className?: string;
    color?: string;
    size?: string;
    onClick?: any;
}
const Icon = (props: iconProps) => {
    const {
        type: propsType,
        color: propsColor = "#999",
        size: propsSize,
        className: propsClass,
        onClick: propsOnClick = () => { }
    } = props;
    const IconComponent = useCallback(() => {
        let returnDom = null;
        switch (propsType) {
            case 'copy':
                returnDom = <svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><style /></defs><path d="M170.667 53.333c17.673 0 32 14.327 32 32v112c0 17.674-14.327 32-32 32h-112c-17.674 0-32-14.327-32-32v-112c0-17.673 14.326-32 32-32h112zm0 16h-112c-8.837 0-16 7.164-16 16v112c0 8.837 7.163 16 16 16h112c8.836 0 16-7.163 16-16v-112c0-8.836-7.164-16-16-16zm-56 26.667a8 8 0 0 1 8 8v29.333H152a8 8 0 0 1 0 16h-29.339l.006 29.334a8 8 0 0 1-16 0l-.006-29.334H77.333a8 8 0 0 1 0-16h29.334V104a8 8 0 0 1 8-8zm8-77.333l81.44.01c24.644.332 33.226 9.39 33.226 34.656v80a8 8 0 0 1-16 0v-80c0-16.915-1.751-18.666-18.666-18.666h-80a8 8 0 0 1 0-16z" fill={propsColor} className="transform-group" /></svg>
                break;
            case 'down':
                returnDom = <svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><style /></defs><path d="M75.2 93.333c-3.2-3.2-8-3.733-11.2-.533-3.2 3.2-3.733 8-.533 11.2 35.2 38.4 53.866 59.2 56.533 61.867 3.733 4.266 11.2 4.266 14.933 0 3.2-3.734 21.867-24 57.067-61.867 3.2-3.2 2.667-8.533-.533-11.2s-8.534-2.667-11.2.533l-51.734 56.534c-.533.533-1.6.533-2.133 0L75.2 93.333z" fill={propsColor} className="transform-group" /></svg>;
                break;
            case 'up':
                returnDom = <svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><style /></defs><path d="M126.933 109.867c.534-.534 1.6-.534 2.134 0L180.8 166.4c3.2 3.2 8 3.733 11.2.533s3.733-8 .533-11.2c-35.2-38.4-53.866-58.666-57.066-61.866-3.734-4.267-11.2-4.267-14.934 0C117.867 96.533 99.2 117.333 64 155.733c-3.2 3.2-2.667 8.534.533 11.2 3.2 3.2 8.534 2.667 11.2-.533l51.2-56.533z" fill={propsColor} className="transform-group" /></svg>;
                break;
            case 'forward':
                returnDom = <svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><style /></defs><path d="M98.133 217.067c-3.2 2.666-8.533 2.666-11.2-1.067-2.666-3.2-2.666-8.533 1.067-10.667l90.133-75.2c1.067-1.066 1.067-3.2 0-4.266L88 50.667c-3.2-2.667-3.733-8-1.067-10.667 2.667-3.2 8-3.733 11.2-1.067l91.734 75.734c10.133 8 10.133 18.666 0 27.2l-91.734 75.2z" fill={propsColor} className="transform-group" /></svg>;
                break;
            case 'more':
                returnDom = <svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><defs><style /></defs><path d="M218.667 144c-9.067 0-16-6.933-16-16s6.933-16 16-16 16 6.933 16 16-6.934 16-16 16zM128 144c-9.067 0-16-6.933-16-16s6.933-16 16-16 16 6.933 16 16-6.933 16-16 16zm-90.667 0c-9.066 0-16-6.933-16-16s6.934-16 16-16 16 6.933 16 16-6.933 16-16 16z" fill={propsColor} className="transform-group" /></svg>; break;
            case 'play':
                returnDom = <svg width="80px" height="80px" viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" ><title>画板</title><g id="画板" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><circle id="椭圆形备份" fillOpacity="0.15" fill="#333333" cx="40" cy="40" r="40"></circle><g id="编组" fill="#FFFFFF" fillRule="nonzero"><g id="Kirby-Yicon-10913" transform="translate(40.000000, 40.000000) scale(-1, 1) rotate(-180.000000) translate(-40.000000, -40.000000) "><rect id="矩形" fillOpacity="0" x="0" y="0" width="80" height="80"></rect><path d="M40,7.61367188 C57.8864844,7.61367188 72.3863281,22.1135156 72.3863281,40 C72.3863281,57.8864844 57.8864844,72.3863281 40,72.3863281 C22.1135156,72.3863281 7.61367188,57.8864844 7.61367188,40 C7.61367188,22.1135156 22.1135156,7.61367188 40,7.61367188 Z M40,2.5 C19.2892969,2.5 2.5,19.2892969 2.5,40 C2.5,60.7107031 19.2892969,77.5 40,77.5 C60.7107031,77.5 77.5,60.7107031 77.5,40 C77.5,19.2892969 60.7107031,2.5 40,2.5 Z M54.9338281,35.4696094 L36.1969531,24.2914062 C32.7744531,22.2495312 30,23.5790625 30,27.2564844 L30,51.0769531 C30,54.7563281 32.7763281,56.0827344 36.1969531,54.0420313 L54.9338281,42.86375 C58.3563281,40.8219531 58.3544531,37.5103906 54.9338281,35.4696094 Z" id="形状"></path></g></g></g></svg>
                break;
            default:
                break;
        }
        return returnDom
    }, [propsType])
    return propsType ? <span className={`iconfont ${propsClass ? propsClass : ""}`} style={{
        width: propsSize,
        height: propsSize,
        fontSize: propsSize
    }}
        onClick={propsOnClick}
    >
        <IconComponent />
    </span> : null
};
export default Icon;