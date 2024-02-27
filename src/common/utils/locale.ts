import { LOCALE, LOCALE_COOKIE_KEY } from "../enum";
import { getCookie } from "./cookie";

export const useLocale = () => {
  let locale = getCookie(LOCALE_COOKIE_KEY);
  if (![LOCALE.enUS, LOCALE.zhCN].includes(locale)) {
    locale = LOCALE.enUS;
  }
  return locale;
};
