import React, { useEffect, useState, useMemo, memo } from "react";
import { Avatar, Divider, Dropdown, Layout, Radio, Space } from "antd";
const { Header } = Layout;
import "./index.scss";
import Link from "next/link";
import { LOCALE, LOCALE_COOKIE_KEY } from "@/common/enum";
import { setCookie } from "@/common/utils/cookie";
import type { RadioChangeEvent } from "antd";
import { useLocale } from "@/common/utils/locale";
import { UserOutlined } from "@ant-design/icons";

const BasicHeader = () => {
  const locale = useLocale();

  const onLocaleChange = (e: RadioChangeEvent) => {
    setCookie(LOCALE_COOKIE_KEY, e.target.value);
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
                label: "logout",
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
