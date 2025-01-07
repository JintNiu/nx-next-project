"use client";
import TrippalMessage, {
  AudioMessage,
  TextMessage,
  ImageMessage,
  CustomContentMessage,
  VideoMessage,
  FileMessage,
} from "@/components/ChatMessage";
import {
  MOCKDATA,
  TextContent,
  TextAtContent,
  TextEmoContent,
  ImgTextContent,
  MarkDownContent,
  MarkDownCodeContent,
  EmotionContent,
  TableContent,
  VideoContent,
  AudioContent,
  FileContent,
  CustomCardContent,
  HistoryCardContent,
  ImgContent,
  UsersData,
} from "@/components/ChatMessage/mock";
import PageLayout from "@/components/layout/PageLayout";
import { AppDispatch, useMyDispatch } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

export default function ChatMessagePage() {
  const dispatch = useMyDispatch();

  return (
    <PageLayout showHeader noPadding pageTitle="聊天记录" backgroundColor="unset">
      <div className="chat-wrapper">
        <TrippalMessage
          data={MOCKDATA}
          language={"zh"}
          onHistoryClick={(info) => {
            console.log(info);
          }}
        />
        {/* <h2>单个消息的DEMO</h2>
        <h4>文本消息</h4>
        <TextMessage message={TextContent} />
        <h4>@文本消息</h4>
        <TextMessage message={TextAtContent} users={UsersData} />
        <h4>文本表情包</h4>
        <TextMessage message={TextEmoContent} />
        <h4>图片消息</h4>
        <ImageMessage message={ImgContent}></ImageMessage>
        <h4>图文混排</h4>
        <CustomContentMessage message={ImgTextContent}></CustomContentMessage>
        <h4>Markdown消息</h4>
        <CustomContentMessage message={MarkDownContent}></CustomContentMessage>
        <h4>Code消息</h4>
        <CustomContentMessage message={MarkDownCodeContent}></CustomContentMessage>
        <h4>Emotion消息</h4>
        <CustomContentMessage message={EmotionContent}></CustomContentMessage>
        <h4>Table消息</h4>
        <CustomContentMessage message={TableContent}></CustomContentMessage>
        <h4>Video消息</h4>
        <VideoMessage message={VideoContent}></VideoMessage>
        <h4>音频消息</h4>
        <AudioMessage message={AudioContent} />
        <h4>文件消息</h4>
        <FileMessage message={FileContent} />
        <h4>告警卡片消息</h4>
        <CustomContentMessage message={CustomCardContent} />
        <h4>聊天记录卡片消息</h4>
        <CustomContentMessage message={HistoryCardContent} /> */}
      </div>
    </PageLayout>
  );
}
