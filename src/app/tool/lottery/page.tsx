"use client";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import { Card, Space, Tag } from "antd";
import React, { useEffect, useState, useMemo, memo, useReducer, useRef } from "react";
import { lotteryData, LotteryData } from "./data";

import "./index.scss";

const maxSelectNumber = 3;

const tagList = [{ name: "和圣兄弟" }, { name: "鲍汁黄焖鸡" }, { name: "鱼你在一起" }];

type TagListType = {
  list: LotteryData[];
  color?: string;
  onClose?: Function;
  onCheck?: Function;
};

const TagList = ({ list = [], color = "green", onCheck, onClose }: TagListType) => {
  return list.map((item) => {
    return (
      <Tag
        key={item.name}
        className="lottery-tag"
        color={color}
        closable={!!onClose}
        style={{ cursor: !!onCheck ? "pointer" : "unset" }}
        onClose={(e) => {
          e.preventDefault();
          onClose?.(item);
        }}
        onClick={() => {
          onCheck?.(item);
        }}
      >
        {item.name}
      </Tag>
    );
  });
};

const Lottery = () => {
  const [data, setData] = useState<LotteryData[]>([]);
  const [selected, setSelected] = useState<LotteryData[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [currentIndex, dispatchCurrentIndex] = useReducer((state: any, action: any) => {
    return action;
  }, 0);

  const timer = useRef<NodeJS.Timeout | undefined>();

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

  const handleDeleteTag = () => {};
  const handleCheckTag = () => {};
  const handleCheckSelectedTag = () => {};

  return (
    <PageLayout showHeader pageTitle="今天吃什么" backgroundColor="unset">
      <div className="lottery-wrapper">
        <div className="lottery-left">
          <Card title="待选店铺（可手动剔除）">
            <TagList list={lotteryData} onClose={handleDeleteTag} onCheck={handleCheckTag} />
          </Card>
          <Card title="本周已选店铺（由右侧选择）">
            <TagList list={tagList} color="gold" />
          </Card>
        </div>

        <Card title="抽取本次店铺" className="lottery-right">
          <div className="lottery-selected">
            {selected.length ? (
              <TagList color="default" list={selected} onCheck={handleCheckSelectedTag} />
            ) : (
              "请点击按钮开始"
            )}
          </div>

          <div className="lottery-content">
            <div className="name">{data?.[currentIndex]?.name}</div>
          </div>

          <Space className="lottery-btn-wrapper">
            {disabled ? (
              <div className="lottery-btn lottery-btn-reset" onClick={handleReset}>
                重置
              </div>
            ) : (
              <div className={`lottery-btn`} onClick={handleClick}>
                {rolling ? "抽取" : "开始"}
              </div>
            )}
          </Space>
        </Card>
      </div>
    </PageLayout>
  );
};

export default memo(Lottery);
