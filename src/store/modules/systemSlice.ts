//counterSlice.jsx

"use client"; //this is a client side component

import { LOCALE, LOCALE_COOKIE_KEY } from "@/common/enum";
import { getCookie, setCookie } from "@/utils/cookie";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState = {
  collapsed: false,
  locale: LOCALE.zhCN,
  path: "/",
};

export const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    setCollapsed: (state, action) => {
      return {
        ...state,
        collapsed: action.payload,
      };
    },
    setLocale: (state, action) => {
      let locale;
      if (action) {
        locale = action.payload;
      } else {
        locale = getCookie(LOCALE_COOKIE_KEY);
      }
      if (![LOCALE.enUS, LOCALE.zhCN].includes(locale)) {
        locale = LOCALE.zhCN;
      }
      setCookie(LOCALE_COOKIE_KEY, locale);
      return {
        ...state,
        locale: locale,
      };
    },
    setPath: (state, action) => {
      return {
        ...state,
        path: action.payload,
      };
    },
  },
});

export const { setCollapsed, setLocale, setPath } = systemSlice.actions;

export default systemSlice.reducer;

export const selectorSystem = (state: RootState) => state.system;
