"use client";
import FlowCanvas from "@/components/FlowCanvas/index.js";
import PageLayout from "@/components/layout/PageLayout";
import { canvasConfigData } from "@/mock/canvas";
import { AppDispatch, useMyDispatch } from "@/store";
import { selectorFlow, setSteps, setStructure } from "@/store/modules/flowSlice";
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
    const { nodes, configs } = canvasConfigData;
    dispatch(setSteps(configs));
    dispatch(setStructure(nodes));
  };

  return (
    <PageLayout
      showHeader
      noPadding
      pageTitle="画布"
      backgroundColor="unset"
      headerOperation={
        <>
          <Button type="primary">编辑</Button>
          <Button type="primary">保存</Button>
        </>
      }
    >
      <div className="canvas-wrapper">
        <FlowCanvas />
      </div>
    </PageLayout>
  );
}
