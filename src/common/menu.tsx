import type { MenuProps } from "antd";
import { SettingOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";

export type MenuItemType = {
  key: string;
  path?: string;
  label?: string;
  icon?: React.ReactNode;
  children?: MenuItemType[];
};

export const routePathMap: Record<string, string> = {
  home: "/",
  analysis: "/dashboard/analysis",
  user: "/user",
  canvas: "/canvas",
  page: "/page",
  form: "/form",
  richText: "/component/richText",
  codeMirror: "/component/codeMirror",
  chat: "/component/chat",
  product: "/board/product",
  project: "/board/project",
  task: "/board/task",
  sprint: "/board/sprint",
  defects: "/board/defects",
  setting: "/setting",
  lottery: "/tool/lottery",
};

export const menuList: MenuItemType[] = [
  {
    label: "首页",
    key: "home",
    icon: <HomeOutlined />,
    path: routePathMap.home,
  },
  {
    label: "数据分析",
    key: "analysis",
    icon: <HomeOutlined />,
    path: routePathMap.analysis,
  },
  {
    label: "用户列表",
    key: "user",
    icon: <UserOutlined />,
    path: routePathMap.user,
  },
  {
    label: "画布",
    key: "canvas",
    icon: <SettingOutlined />,
    path: routePathMap.canvas,
  },
  {
    label: "动态页面",
    key: "page",
    icon: <SettingOutlined />,
    path: routePathMap.page,
  },
  {
    label: "动态表单",
    key: "form",
    icon: <SettingOutlined />,
    path: routePathMap.form,
  },
  {
    label: "组件",
    key: "component",
    icon: <SettingOutlined />,
    children: [
      {
        label: "富文本",
        key: "richText",
        path: routePathMap.richText,
      },
      {
        label: "代码编辑器",
        key: "codeMirror",
        path: routePathMap.codeMirror,
      },
      {
        label: "聊天记录",
        key: "chat",
        path: routePathMap.chat,
      },
    ],
  },
  {
    label: "看板",
    key: "board",
    icon: <SettingOutlined />,
    children: [
      {
        label: "产品线",
        key: "product",
        icon: <SettingOutlined />,
        path: routePathMap.product,
      },
      {
        label: "需求",
        key: "project",
        icon: <SettingOutlined />,
        path: routePathMap.project,
      },
      {
        label: "任务",
        key: "task",
        icon: <SettingOutlined />,
        path: routePathMap.task,
      },
      {
        label: "迭代看板",
        key: "sprint",
        icon: <SettingOutlined />,
        path: routePathMap.sprint,
      },
      {
        label: "缺陷",
        key: "defects",
        icon: <SettingOutlined />,
        path: routePathMap.defects,
      },
    ],
  },
  {
    label: "工具",
    key: "tool",
    icon: <SettingOutlined />,
    children: [
      {
        label: "抽奖",
        key: "lottery",
        path: routePathMap.lottery,
      },
    ],
  },
  {
    label: "设置",
    key: "setting",
    icon: <SettingOutlined />,
    path: routePathMap.setting,
  },
];
