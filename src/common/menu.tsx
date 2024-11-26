import type { MenuProps } from "antd";
import { SettingOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";

export type MenuItemType = {
  key: string;
  path?: string;
  label?: string;
  icon?: React.ReactNode;
  children?: MenuItemType[];
};

export const menuList: MenuItemType[] = [
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
        key: "product",
        icon: <SettingOutlined />,
        path: "/product",
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
    path: "/setting",
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
  analysis: "/dashboard/analysis",
  user: "/user",
  canvas: "/canvas",
  page: "/page",
  form: "/form",
  board: "/board",
  product: "/board/product",
  project: "/board/project",
  task: "/board/task",
  sprint: "/board/sprint",
  defects: "/board/defects",
  setting: "/setting",
  lottery: "/tool/lottery",
};
