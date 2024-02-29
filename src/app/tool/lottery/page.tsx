"use client";
import PageLayout from "@/components/layout/PageLayout";
import TagList from "@/components/lottery/TagList";
import TagListCard from "@/components/lottery/TagListCard";
import { Card, Space, Tag } from "antd";
import React, { useEffect, useState, useMemo, memo, useReducer, useRef } from "react";
import { lotteryData, LotteryData } from "./data";

import "./index.scss";

const maxSelectNumber = 3;

const tagList = [{ name: "和圣兄弟" }, { name: "鲍汁黄焖鸡" }, { name: "鱼你在一起" }];

const Lottery = () => {
  const [sourceData, setSourceData] = useState<LotteryData[]>([]);//所有店铺
  const [selectList, setSelectList] = useState<LotteryData[]>([]);//待选店铺
  const [weekList, setWeekList] = useState<LotteryData[]>([]);//本周已选
  const [selected, setSelected] = useState<LotteryData[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [currentIndex, dispatchCurrentIndex] = useReducer((state: any, action: any) => {
    return action;
  }, 0);

  const timer = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    setSourceData(lotteryData);
    setSelectList(JSON.parse(JSON.stringify(lotteryData)));
  }, []);

  const getRandomNumber = () => {
    return Math.floor(Math.random() * selectList.length);
  };

  useEffect(() => {
    if (selected.length >= maxSelectNumber) {
      setRolling(false);
      setDisabled(true);
      clearInterval(timer.current);
      timer.current = undefined;
    }
  }, [selected]);

  // 待选列表需要提出本周已选
  useEffect(() => {
    setSelectList(handleDelete(selectList, weekList))
  }, [weekList]);

  const handleDelete = (list: LotteryData[] = [], deleteList: LotteryData[] = []) => {
    let _list = [...list];
    deleteList.forEach(del => {
      const delIdx = _list.findIndex(item => item.name === del.name);
      delIdx > -1 && _list.splice(delIdx, 1);
    })
    console.log("_list", _list);
    return _list;

  }

  const handleClick = () => {
    // 开始
    if (!rolling) {
      setRolling(true);
      timer.current = setInterval(() => {
        dispatchCurrentIndex(getRandomNumber());
      }, 50);
      return;
    }
    setSelected([...selected, selectList[currentIndex]]);
  };

  const handleReset = () => {
    setSelected([]);
    setDisabled(false);
    setRolling(false);
    dispatchCurrentIndex(0);
    clearInterval(timer.current);
    timer.current = undefined;
  };

  const handleDeleteTag = (deleteTag: LotteryData) => {
    setSelectList(handleDelete(selectList, [deleteTag]));
  };

  const handleCheckTag = () => { };

  const handleCheckSelectedTag = (tag: LotteryData) => {
    setWeekList(Array.from(new Set([
      ...weekList,
      tag
    ])))
  };

  return (
    <PageLayout showHeader pageTitle="今天吃什么" backgroundColor="unset">
      <div className="lottery-wrapper">
        <div className="lottery-left">
          <TagListCard title="待选店铺" list={selectList} onCheck={handleCheckTag} onClose={handleDeleteTag} />
        </div>
        <div className="lottery-right">
          <TagListCard title="本周已选店铺" list={weekList} color="gold" />
          <Card title="抽取本次就餐店铺" className="lottery-content-card">
            <div className="lottery-selected">
              {selected.length ? (
                <TagList color="default" list={selected} onCheck={handleCheckSelectedTag} />
              ) : (
                "请点击按钮开始"
              )}
            </div>

            <div className="lottery-content">
              <div className="name">{selectList?.[currentIndex]?.name}</div>
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
      </div>
    </PageLayout>
  );
};

export default memo(Lottery);
