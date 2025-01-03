"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import counterReducer from "./modules/counterSlice";
import systemSlice from "./modules/systemSlice";
import flowSlice from "./modules/flowSlice";

const rootReducer = combineReducers({
  counter: counterReducer,
  system: systemSlice,
  flow: flowSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

// 为什么不对？
// export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
//   return <Provider store={store} children={children} />;
// };

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useMyDispatch = () => {
  return useDispatch<AppDispatch>();
};
