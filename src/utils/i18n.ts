import { getCookie } from "./cookie";

export const COOKIELOCALEKEY = 'nx_locale';

export const LOCALE = {
    zhCN: 'zh-CN',
    enUS: 'en-US'
};


export const getI18n = (key, defaultValue) => {
    return defaultValue;
};

export const useLocale = () => {
    let locale = getCookie(COOKIELOCALEKEY);
    if (![LOCALE.enUS, LOCALE.zhCN].includes(locale)) {
        locale = LOCALE.enUS;
    }
    return locale;
}

export const isZH = useLocale() === LOCALE.zhCN;