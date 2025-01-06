"use client";
import FlowCanvas from "@/components/FlowCanvas/index.js";
import PageLayout from "@/components/layout/PageLayout";
import { mockCanvasConfigData, mockComponentMap } from "@/mock/canvas";
import { AppDispatch, useMyDispatch } from "@/store";
import {
  selectorFlow,
  setSteps,
  setStructure,
  setEditing,
  setComponentMap,
} from "@/store/modules/flowSlice";
import { Button } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

export default function CounterControl() {
  const dispatch = useMyDispatch();
  const {
    editing,
    componentMap,
    triggerMap,
    structure,
    steps,
    activeNodeId,
    centerNodeId,
    paste,
    nodePopOpen,
    nodePopFocus,
    foldedMap,
    selectorRange,
    drag,
    flowError,
  } = useSelector(selectorFlow);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const { nodes, configs } = mockCanvasConfigData;
    dispatch(setSteps(configs));
    dispatch(setStructure(nodes));
    dispatch(setComponentMap(mockComponentMap));
  };

  const handleEdit = () => {
    dispatch(setEditing(true));
  };

  const handleSave = () => {
    dispatch(setEditing(false));
  };

  return (
    <PageLayout
      showHeader
      noPadding
      pageTitle="画布"
      backgroundColor="unset"
      headerOperation={
        editing ? (
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        ) : (
          <Button type="primary" onClick={handleEdit}>
            编辑
          </Button>
        )
      }
    >
      <div className="canvas-wrapper">
        <FlowCanvas />
      </div>
    </PageLayout>
  );
}
