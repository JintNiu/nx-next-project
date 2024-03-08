"use client";
import "@/assets/styles/globals.css";
import { Inter } from "next/font/google";
import { ConfigProvider, Layout, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { Metadata } from "next";
import "./index.scss";
import SiderMenu from "@/components/layout/SiderMenu";
import BasicHeader from "@/components/layout/BasicHeader";
import { store } from "@/store";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const { Content } = Layout;

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "nx",
//   description: "...",
// };

export const ReduxProvider = ({ children }) => {
  return <Provider store={store} children={children} />;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Management</title>
      </head>
      <body className={inter.className}>
        <ReduxProvider
          children={
            <ConfigProvider locale={zhCN}>
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
          }
        />
      </body>
    </html>
  );
}
