import type { MenuProps } from "antd";
import { SettingOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";

export type MenuItemType = MenuProps["items"] & {
  path?: string;
};

export const menuList: MenuItemType = [
  {
    label: "首页",
    key: "home",
    icon: <HomeOutlined />,
    path: "/",
  },
  {
    label: "数据分析",
    key: "analysis",
    icon: <HomeOutlined />,
    path: "/dashboard/analysis",
  },
  {
    label: "用户列表",
    key: "user",
    icon: <UserOutlined />,
    path: "/user",
  },
  {
    label: "画布",
    key: "canvas",
    icon: <SettingOutlined />,
    path: "/canvas",
  },
  {
    label: "动态页面",
    key: "page",
    icon: <SettingOutlined />,
    path: "/page",
  },
  {
    label: "动态表单",
    key: "form",
    icon: <SettingOutlined />,
    path: "/form",
  },
  {
    label: "看板",
    key: "board",
    icon: <SettingOutlined />,
    path: "/board",
    children: [
      {
        label: "产品线",
        key: "productLines",
        icon: <SettingOutlined />,
        path: "/productlines",
      },
      {
        label: "需求",
        key: "project",
        icon: <SettingOutlined />,
        path: "/project",
      },
      {
        label: "任务",
        key: "task",
        icon: <SettingOutlined />,
        path: "/task",
      },
      {
        label: "迭代看板",
        key: "sprint",
        icon: <SettingOutlined />,
        path: "/sprint",
      },
      {
        label: "缺陷",
        key: "defects",
        icon: <SettingOutlined />,
        path: "/defects",
      },
    ],
  },
  {
    label: "设置",
    key: "setting",
    icon: <SettingOutlined />,
    path: "/user",
  },
  {
    label: "其他",
    key: "tool",
    icon: <SettingOutlined />,
    children: [
      {
        label: "抽奖",
        key: "lottery",
        path: "/tool/lottery",
      },
    ],
  },
];

export const routePathMap: Record<string, string> = {
  home: "/",
  setting: "/setting",
  user: "/user",
  lottery: "/tool/lottery",
};
