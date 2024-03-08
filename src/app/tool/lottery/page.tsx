"use client";
import { lotteryData, LotteryDataType } from "@/common/data/lottery";
import { getStorage, setStorage } from "@/common/utils/cookie";
import { getWeek } from "@/common/utils/date";
import PageLayout from "@/components/layout/PageLayout";
import TagList from "@/components/lottery/TagList";
import TagListCard from "@/components/lottery/TagListCard";
import { Card, Space, Tag } from "antd";
import React, { useEffect, useState, useMemo, memo, useReducer, useRef } from "react";

import "./index.scss";

const maxSelectNumber = 3;
const WEEK_COOKIE_KEY = "WEEK_COOKIE";

const Lottery = () => {
  const [sourceData, setSourceData] = useState<LotteryDataType[]>([]); //所有店铺
  const [selectList, setSelectList] = useState<LotteryDataType[]>([]); //待选店铺
  const [weekList, setWeekList] = useState<LotteryDataType[]>([]); //本周已选
  const [selected, setSelected] = useState<LotteryDataType[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [currentIndex, dispatchCurrentIndex] = useReducer((state: any, action: any) => {
    return action;
  }, 0);

  const timer = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    setSourceData(JSON.parse(JSON.stringify(lotteryData)));

    const cookieValue = getStorage(WEEK_COOKIE_KEY);
    const cookieWeekData = cookieValue ? JSON.parse(cookieValue) : null;
    const currentWeek = getWeek(new Date());

    if (!cookieWeekData || cookieWeekData.week !== currentWeek) {
      setStorage(
        WEEK_COOKIE_KEY,
        JSON.stringify({
          week: currentWeek,
          data: [],
        })
      );
      setWeekList([]);
      return;
    }
    setWeekList(cookieWeekData.data);
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
    if (weekList.length) {
      setSelectList(sourceData.filter((item) => !weekList.find((week) => week.name === item.name)));
    } else {
      setSelectList(sourceData);
    }
  }, [sourceData, weekList]);

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

  const handleDeleteTag = (deleteTag: LotteryDataType) => {
    setSelectList(selectList.filter((item) => item.name !== deleteTag.name));
  };

  const handleCheckTag = (tag: LotteryDataType) => {
    handleCheckSelectedTag(tag);
  };

  const handleCheckSelectedTag = (tag: LotteryDataType) => {
    const _list = Array.from(new Set([...weekList, tag]));
    setWeekList(_list);
    setStorage(
      WEEK_COOKIE_KEY,
      JSON.stringify({
        week: getWeek(new Date()),
        data: _list,
      })
    );
  };

  const handleDeleteWeek = (tag: LotteryDataType) => {
    const _list = weekList.filter((item) => item.name !== tag.name);
    setWeekList(_list);
    setStorage(
      WEEK_COOKIE_KEY,
      JSON.stringify({
        week: getWeek(new Date()),
        data: _list,
      })
    );
  };

  return (
    <PageLayout showHeader pageTitle="抽奖" backgroundColor="unset">
      <div className="lottery-wrapper">
        <div className="lottery-left">
          <TagListCard
            title="待选"
            list={selectList}
            onCheck={handleCheckTag}
            onClose={handleDeleteTag}
          />
        </div>
        <div className="lottery-right">
          {/* 本周已选 */}
          <TagListCard title="本周已选" list={weekList} color="gold" onCheck={handleDeleteWeek} />
          {/* 抽取本次 */}
          <Card title="抽取本次" className="lottery-content-card">
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
