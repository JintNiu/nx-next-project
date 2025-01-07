import React, { useMemo } from 'react';
import { PrefixCls } from '../../constants';
import './index.scss';
const staticIconUrl = 'https://pages.c-ctrip.com/trippal/trippal-message-assets/fileMsgIcon/';
const FileIconUrlMap = {
    FileMsg7ZIcon: `${staticIconUrl}7Z.png`,
    FileMsgCSVIcon: `${staticIconUrl}CSV.png`,
    FileMsgEXCELIcon: `${staticIconUrl}EXCEL.png`,
    FileMsgGIFIcon: `${staticIconUrl}GIF.png`,
    FileMsgHTMLIcon: `${staticIconUrl}HTML.png`,
    FileMsgJPEGIcon: `${staticIconUrl}JPEG.png`,
    FileMsgJPGIcon: `${staticIconUrl}JPG.png`,
    FileMsgKEYNOTEIcon: `${staticIconUrl}KEYNOTE.png`,
    FileMsgLOGIcon: `${staticIconUrl}LOG.png`,
    FileMsgPDFIcon: `${staticIconUrl}PDF.png`,
    FileMsgPNGIcon: `${staticIconUrl}PNG.png`,
    FileMsgPPSIcon: `${staticIconUrl}PPS.png`,
    FileMsgPPTIcon: `${staticIconUrl}PPT.png`,
    FileMsgPPTSIcon: `${staticIconUrl}PPTS.png`,
    FileMsgRARIcon: `${staticIconUrl}RAR.png`,
    FileMsgTARIcon: `${staticIconUrl}TAR.png`,
    FileMsgTXTIcon: `${staticIconUrl}TXT.png`,
    FileMsgTGZIcon: `${staticIconUrl}TGZ.png`,
    FileMsgWEBPIcon: `${staticIconUrl}WEBP.png`,
    FileMsgWORDIcon: `${staticIconUrl}WORD.png`,
    FileMsgXMLIcon: `${staticIconUrl}XML.png`,
    FileMsgZIPIcon: `${staticIconUrl}ZIP.png`,
    FileMsgEMAILIcon: `${staticIconUrl}EMAIL.png`,
    FileMsgSKETCHIcon: `${staticIconUrl}SKETCH.png`,
    FileMsgIcon: `${staticIconUrl}file_icon_other.png`,
    FileMsg7ZSquareIcon: `${staticIconUrl}1_1/7Z.png`,
    FileMsgCSVSquareIcon: `${staticIconUrl}1_1/CSV.png`,
    FileMsgEXCELSquareIcon: `${staticIconUrl}1_1/EXCEL.png`,
    FileMsgGIFSquareIcon: `${staticIconUrl}1_1/GIF.png`,
    FileMsgHTMLSquareIcon: `${staticIconUrl}1_1/HTML.png`,
    FileMsgJPEGSquareIcon: `${staticIconUrl}1_1/JPEG.png`,
    FileMsgJPGSquareIcon: `${staticIconUrl}1_1/JPG.png`,
    FileMsgKEYNOTESquareIcon: `${staticIconUrl}1_1/KEYNOTE.png`,
    FileMsgLOGSquareIcon: `${staticIconUrl}1_1/LOG.png`,
    FileMsgPDFSquareIcon: `${staticIconUrl}1_1/PDF.png`,
    FileMsgPNGSquareIcon: `${staticIconUrl}1_1/PNG.png`,
    FileMsgPPSSquareIcon: `${staticIconUrl}1_1/PPS.png`,
    FileMsgPPTSquareIcon: `${staticIconUrl}1_1/PPT.png`,
    FileMsgPPTSSquareIcon: `${staticIconUrl}1_1/PPTS.png`,
    FileMsgRARSquareIcon: `${staticIconUrl}1_1/RAR.png`,
    FileMsgTARSquareIcon: `${staticIconUrl}1_1/TAR.png`,
    FileMsgTXTSquareIcon: `${staticIconUrl}1_1/TXT.png`,
    FileMsgTGZSquareIcon: `${staticIconUrl}1_1/TGZ.png`,
    FileMsgWEBPSquareIcon: `${staticIconUrl}1_1/WEBP.png`,
    FileMsgWORDSquareIcon: `${staticIconUrl}1_1/WORD.png`,
    FileMsgXMLSquareIcon: `${staticIconUrl}1_1/XML.png`,
    FileMsgZIPSquareIcon: `${staticIconUrl}1_1/ZIP.png`,
    FileMsgEMAILSquareIcon: `${staticIconUrl}1_1/EMAIL.png`,
    FileMsgSKETCHSquareIcon: `${staticIconUrl}1_1/SKETCH.png`,

    FileMsgSquareIcon: `${staticIconUrl}1_1/file_icon_other.png`,
};
interface FileIconProps {
    fileName: string;
}
export default (props: FileIconProps) => {
    const {
        fileName: propsFileName,
    } = props;
    // icon的配置
    const ICON_CONFIG = [
        {
            ext: ['.msg'],
            icon: FileIconUrlMap.FileMsgEMAILIcon,
            squareIcon: FileIconUrlMap.FileMsgEMAILSquareIcon,
        },
        {
            ext: ['.7z'],
            icon: FileIconUrlMap.FileMsg7ZIcon,
            squareIcon: FileIconUrlMap.FileMsg7ZSquareIcon,
        },
        {
            ext: ['.csv'],
            icon: FileIconUrlMap.FileMsgCSVIcon,
            squareIcon: FileIconUrlMap.FileMsgCSVSquareIcon,
        },
        {
            ext: ['.xls', '.xlsx'],
            icon: FileIconUrlMap.FileMsgEXCELIcon,
            squareIcon: FileIconUrlMap.FileMsgEXCELSquareIcon,
        },
        {
            ext: ['.gif'],
            icon: FileIconUrlMap.FileMsgGIFIcon,
            squareIcon: FileIconUrlMap.FileMsgGIFSquareIcon,
        },
        {
            ext: ['.html'],
            icon: FileIconUrlMap.FileMsgHTMLIcon,
            squareIcon: FileIconUrlMap.FileMsgHTMLSquareIcon,
        },
        {
            ext: ['.jpeg'],
            icon: FileIconUrlMap.FileMsgJPEGIcon,
            squareIcon: FileIconUrlMap.FileMsgJPEGSquareIcon,
        },
        {
            ext: ['.jpg'],
            icon: FileIconUrlMap.FileMsgJPGIcon,
            squareIcon: FileIconUrlMap.FileMsgJPGSquareIcon,
        },
        {
            ext: ['.keynote', '.key'],
            icon: FileIconUrlMap.FileMsgKEYNOTEIcon,
            squareIcon: FileIconUrlMap.FileMsgKEYNOTESquareIcon,
        },
        {
            ext: ['.log'],
            icon: FileIconUrlMap.FileMsgLOGIcon,
            squareIcon: FileIconUrlMap.FileMsgLOGSquareIcon,
        },
        {
            ext: ['.pdf'],
            icon: FileIconUrlMap.FileMsgPDFIcon,
            squareIcon: FileIconUrlMap.FileMsgPDFSquareIcon,
        },
        {
            ext: ['.png'],
            icon: FileIconUrlMap.FileMsgPNGIcon,
            squareIcon: FileIconUrlMap.FileMsgPNGSquareIcon,
        },
        {
            ext: ['.pps'],
            icon: FileIconUrlMap.FileMsgPPSIcon,
            squareIcon: FileIconUrlMap.FileMsgPPSSquareIcon,
        },
        {
            ext: ['.ppt', '.pptx'],
            icon: FileIconUrlMap.FileMsgPPTIcon,
            squareIcon: FileIconUrlMap.FileMsgPPTSquareIcon,
        },
        {
            ext: ['.ppts'],
            icon: FileIconUrlMap.FileMsgPPTSIcon,
            squareIcon: FileIconUrlMap.FileMsgPPTSSquareIcon,
        },
        {
            ext: ['.rar'],
            icon: FileIconUrlMap.FileMsgRARIcon,
            squareIcon: FileIconUrlMap.FileMsgRARSquareIcon,
        },
        {
            ext: ['.tar'],
            icon: FileIconUrlMap.FileMsgTARIcon,
            squareIcon: FileIconUrlMap.FileMsgTARSquareIcon,
        },
        {
            ext: ['.txt'],
            icon: FileIconUrlMap.FileMsgTXTIcon,
            squareIcon: FileIconUrlMap.FileMsgTXTSquareIcon,
        },
        {
            ext: ['.tgz'],
            icon: FileIconUrlMap.FileMsgTGZIcon,
            squareIcon: FileIconUrlMap.FileMsgTGZSquareIcon,
        },
        {
            ext: ['.webp'],
            icon: FileIconUrlMap.FileMsgWEBPIcon,
            squareIcon: FileIconUrlMap.FileMsgWEBPSquareIcon,
        },
        {
            ext: ['.doc', '.docx'],
            icon: FileIconUrlMap.FileMsgWORDIcon,
            squareIcon: FileIconUrlMap.FileMsgWORDSquareIcon,
        },
        {
            ext: ['.xml'],
            icon: FileIconUrlMap.FileMsgXMLIcon,
            squareIcon: FileIconUrlMap.FileMsgXMLSquareIcon,
        },
        {
            ext: ['.zip'],
            icon: FileIconUrlMap.FileMsgZIPIcon,
            squareIcon: FileIconUrlMap.FileMsgZIPSquareIcon,
        },
        {
            ext: ['.sketch'],
            icon: FileIconUrlMap.FileMsgSKETCHIcon,
            squareIcon: FileIconUrlMap.FileMsgSKETCHSquareIcon,
        },
    ];
    const fileIconUrl = useMemo(() => {
        if (propsFileName) {
            let curFileName = propsFileName.toLowerCase();
            let iconUrl = null;
            ICON_CONFIG.some((item) => {
                const find = item.ext.some(e => curFileName.endsWith(e.toLowerCase()));
                if (find) {
                    iconUrl = item.icon;
                    return true;
                }
                return false;
            });
            if (iconUrl) {
                return iconUrl;
            }
        }
        return FileIconUrlMap.FileMsgIcon;
    }, [propsFileName]);
    return (
        <>
            <img className={`${PrefixCls}-icon-img`} src={fileIconUrl} alt="" />
        </>
    );
};
