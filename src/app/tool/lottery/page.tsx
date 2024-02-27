"use client";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { Space } from "antd";
import React, { useEffect, useState, useMemo, memo, useReducer, useRef } from "react";
import { lotteryData, LotteryData } from "./data";

import "./index.scss";

const maxSelectNumber = 3;

const Lottery = () => {
  const [data, setData] = useState<LotteryData[]>([]);
  const [selected, setSelected] = useState<LotteryData[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [currentIndex, dispatchCurrentIndex] = useReducer((state: any, action: any) => {
    return action;
  }, 0);

  const timer = useRef<string | number | NodeJS.Timeout | undefined>();

  useEffect(() => {
    setData(lotteryData);
  }, []);

  const getRandomNumber = () => {
    return Math.floor(Math.random() * data.length);
  };

  useEffect(() => {
    if (selected.length >= maxSelectNumber) {
      setRolling(false);
      setDisabled(true);
      clearInterval(timer.current);
      timer.current = undefined;
    }
  }, [selected]);

  const handleClick = () => {
    // 开始
    if (!rolling) {
      setRolling(true);
      //   setDisabled(true);
      timer.current = setInterval(() => {
        dispatchCurrentIndex(getRandomNumber());
      }, 50);
      return;
    }
    setSelected([...selected, data[currentIndex]]);
    // setRolling(false);
    // setDisabled(false);
    // clearInterval(timer.current);
    // timer.current = undefined;
  };

  const handleReset = () => {
    setSelected([]);
    setDisabled(false);
    setRolling(false);
    dispatchCurrentIndex(0);
    clearInterval(timer.current);
    timer.current = undefined;
  };

  return (
    <PageLayout showHeader pageTitle="今天吃什么">
      <div className="lottery-wrapper">
        <Space className="lottery-selected">
          已选：
          {selected.length
            ? selected.map((item) => {
                return <span key={item.name}>{item.name}</span>;
              })
            : "请点击按钮开始"}
        </Space>
        <div className="lottery-content">
          <div className="name">{data?.[currentIndex]?.name}</div>
        </div>

        <Space className="lottery-btn-wrapper">
          {disabled ? (
            <div className="lottery-btn lottery-btn-reset" onClick={handleReset}>
              Reset
            </div>
          ) : (
            <div className={`lottery-btn`} onClick={handleClick}>
              {rolling ? "抽取" : "Start"}
            </div>
          )}
        </Space>
      </div>
    </PageLayout>
  );
};

export default memo(Lottery);
