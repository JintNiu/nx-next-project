import React, { useCallback } from 'react';
import { PrefixCls } from '../../../../constants';
import linkifyStr from 'linkify-string';
import './index.scss';
import DefaultMessage from '../../../DefaultMessage';
import i18n from '../../../../utils/i18n/I18nUtil';
interface MessageItemProps {
    rows: [];
    rowCount: number;
}
interface MessageProps {
    tableList: MessageItemProps[];
    showCite?: boolean;
    language?: string;
}

export default (props: MessageProps) => {
    const {
        tableList: propsTableList,
        showCite: propsShowCite = false,
        language: propsLan
    } = props;
    const stopDefaultFunc = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        if (
            event.target.tagName === 'A'
            && !!event.target.href
            && event.target.target !== '_blank'
        ) {
            event.preventDefault();
            window.open(event.target.href);
        }
    };
    const getRowList = useCallback((table) => {
        if (table.rows.length > table.rowCount) {
            return table.rows.filter(() => true).splice(0, table.rowCount);
        }
        return table.rows;
    }, [propsTableList]);
    const getCellRowSpan = (cell: any) => {
        if (cell && cell.rowSpan) {
            return cell.rowSpan;
        }
        return 1;
    };
    const getCellColSpan = (cell: any) => {
        if (cell && cell.colSpan) {
            return cell.colSpan;
        }
        return 1;
    };
    const renderText = (cell: any) => {
        if (cell && cell.text) {
            return linkifyStr(cell.text);
        }
        return '';
    };
    const renderTrChild = useCallback((trChildProps: {
        type: string,
        value: any,
    }) => {
        let useCells = trChildProps.value.cells.filter((r: any) => !r || r.type !== 'ref');
        let cellListReturn: any[] = [];
        if (useCells.length) {
            useCells.forEach((cell: any, ci: number) => {
                let rowspan = getCellRowSpan(cell);
                let colspan = getCellColSpan(cell);
                if (trChildProps.type === 'th') {
                    cellListReturn.push(
                        <th
                            key={ci}
                            rowSpan={rowspan}
                            colSpan={colspan}
                            dangerouslySetInnerHTML={{ __html: renderText(cell) }}></th>,
                    );
                } else {
                    cellListReturn.push(
                        <td
                            key={ci}
                            rowSpan={rowspan}
                            colSpan={colspan}
                            dangerouslySetInnerHTML={{ __html: renderText(cell) }}></td>,
                    );
                }
            });
        }
        return cellListReturn;
    }, [propsTableList]);
    const tableItemList = useCallback((curTableList) => {
        let returnTable: any[] = [];
        let formatList = curTableList;
        if (formatList.length) {
            formatList.forEach((itemTab: any, idxTab: number) => {
                // 当前cell的类型是head的时候
                returnTable.push(
                    <tr key={idxTab}>
                        {renderTrChild({ type: itemTab.type === 'head' ? 'th' : 'td', value: itemTab })}
                    </tr>,
                );
            });
        }
        if (returnTable.length) {
            return <tbody>
                {returnTable}
            </tbody>;
        } else {
            return null;
        }
    }, [propsTableList]);
    return (
        <div className={`${PrefixCls}-table-content`} onClick={stopDefaultFunc}>
            {
                !propsShowCite ? (
                    propsTableList.length > 0 ? (
                        propsTableList.map((table, ti) => {
                            let curTableList = getRowList(table);
                            return <div key={`${ti}`} className={`${PrefixCls}-table-wrapper`}>
                                {/* table的分割线 */}
                                {ti > 0 ? (<hr />) : null}

                                {/* 展示table */}
                                <table>

                                    {
                                        curTableList.length > 0 ? (
                                            tableItemList(curTableList)
                                        ) : null
                                    }
                                </table>
                            </div>;
                        })
                    ) : null
                ) : <DefaultMessage showCite={true} showContent={i18n(propsLan, 'table')} />
            }
        </div>
    );
};
