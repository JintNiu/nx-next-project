//counterSlice.jsx

"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState = {
  activeNodeId: null,
  editing: false,
  triggerMap: {},
  componentMap: {},
  structure: [],
  steps: {},
  centerNodeId: null,
  paste: null,
  nodePopOpen: null,
  nodePopFocus: null,
  foldedMap: {},
  selectorRange: null,
  drag: null,
  flowError: {
    errorMap: {},
  },
};

export const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setActiveNodeId: (state, action) => {
      return {
        ...state,
        activeNodeId: action.payload,
      };
    },
    setEditing: (state, action) => {
      return {
        ...state,
        editing: action.payload,
      };
    },
    setTriggerMap: (state, action) => {
      return {
        ...state,
        triggerMap: action.payload,
      };
    },
    setComponentMap: (state, action) => {
      return {
        ...state,
        componentMap: action.payload,
      };
    },
    setStructure: (state, action) => {
      return {
        ...state,
        structure: action.payload,
      };
    },
    setSteps: (state, action) => {
      return {
        ...state,
        steps: action.payload,
      };
    },
    setCenterNodeId: (state, action) => {
      return {
        ...state,
        centerNodeId: action.payload,
      };
    },
    setPaste: (state, action) => {
      return {
        ...state,
        paste: action.payload,
      };
    },
    setNodePopOpen: (state, action) => {
      return {
        ...state,
        nodePopOpen: action.payload,
      };
    },
    setNodePopFocus: (state, action) => {
      return {
        ...state,
        nodePopFocus: action.payload,
      };
    },
    setFoldedMap: (state, action) => {
      return {
        ...state,
        foldedMap: action.payload,
      };
    },
    setSelectorRange: (state, action) => {
      return {
        ...state,
        selectorRange: action.payload,
      };
    },
    setDrag: (state, action) => {
      return {
        ...state,
        drag: action.payload,
      };
    },
    setFlowError: (state, action) => {
      return {
        ...state,
        flowError: action.payload,
      };
    },
  },
});

export const {
  setActiveNodeId,
  setEditing,
  setTriggerMap,
  setComponentMap,
  setStructure,
  setSteps,
  setCenterNodeId,
  setDrag,
  setFoldedMap,
  setNodePopFocus,
  setNodePopOpen,
  setPaste,
  setSelectorRange,
} = flowSlice.actions;

export default flowSlice.reducer;

export const selectorFlow = (state: RootState) => state.flow;
