"use client";
import "@/assets/styles/globals.css";
import { ConfigProvider, Layout, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { Metadata } from "next";
import "./index.scss";
import SiderMenu from "@/components/layout/SiderMenu";
import BasicHeader from "@/components/layout/BasicHeader";

const { Content } = Layout;

// export const metadata: Metadata = {
//   title: "nx",
//   description: "...",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>nx Site</title>
      </head>
      <body>
        <ConfigProvider
          locale={zhCN}
          theme={{
            hashed: false,
            token: {
              borderRadius: 0,
              colorPrimary: "#3264ff",
              colorInfo: "#3264ff",
              colorTextBase: "#4a535d",
              colorBorder: "#dbe0e5",
            },
          }}
        >
          <Layout className="app-layout-wrapper">
            <BasicHeader />

            <Layout className="app-layout">
              <SiderMenu />
              <Spin spinning={false} wrapperClassName="app-layout-spin">
                <Content className="app-layout-children">{children}</Content>
              </Spin>
            </Layout>
          </Layout>
        </ConfigProvider>
      </body>
    </html>
  );
}
