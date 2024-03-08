import React, { useEffect, useState, useMemo, memo } from "react";
import { Avatar, Divider, Dropdown, Layout, Radio, Space } from "antd";
const { Header } = Layout;
import "./index.scss";
import Link from "next/link";
import { LOCALE, LOCALE_COOKIE_KEY } from "@/common/enum";
import type { RadioChangeEvent } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useMyDispatch } from "@/store";
import { selectorSystem, setLocale } from "@/store/modules/systemSlice";

const BasicHeader = () => {
  const dispatch = useMyDispatch();
  const { locale } = useSelector(selectorSystem);

  const onLocaleChange = (e: RadioChangeEvent) => {
    dispatch(setLocale(e.target.value));
    // window.location.reload();
  };

  return (
    <Header className="app-header">
      <Link href="/">
        <div className="app-logo">管理系统</div>
      </Link>
      <div className="app-layout-header-right">
        <Radio.Group
          options={[
            {
              label: "中文",
              value: LOCALE.zhCN,
            },
            {
              label: "English",
              value: LOCALE.enUS,
            },
          ]}
          onChange={onLocaleChange}
          value={locale}
          optionType="button"
          buttonStyle="solid"
        />
        <Divider type="vertical" />
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <>
                    <LogoutOutlined style={{ marginRight: "10px" }} />
                    logout
                  </>
                ),
                key: "logout",
              },
            ],
            // onClick: handleUserClick,
          }}
          //   onOpenChange={userOpenChange}
        >
          <Space className="app-layout-header-avatar">
            <Avatar icon={<UserOutlined />} alt="avatar" />
            <span>{"nx"}</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default memo(BasicHeader);
