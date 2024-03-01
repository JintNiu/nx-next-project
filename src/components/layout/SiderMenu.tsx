import { Layout, Menu, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SettingOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./index.scss";

const { Sider } = Layout;

const items: MenuProps["items"] = [
  {
    label: "首页",
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: "用户列表",
    key: "user",
    icon: <UserOutlined />,
  },
  {
    label: "设置",
    key: "setting",
    icon: <SettingOutlined />,
  },
  {
    label: "工具",
    key: "tool",
    icon: <SettingOutlined />,
    children: [
      {
        label: "摇奖",
        key: "lottery",
      },
    ],
  },
];

const pathMap: Record<string, string> = {
  home: "/",
  setting: "/setting",
  user: "/user",
  lottery: "/tool/lottery",
};

const SiderMenu = () => {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuProps["items"]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const changeMenu: MenuProps["onClick"] = (e) => {
    router.push(pathMap[e.key]);
  };

  useEffect(() => {
    setMenus(items);
    // setMenus(AdminStore.modules.menuModules.map((item) => getItem(item)));
  }, []);

  return (
    <Sider
      theme="light"
      className="app-sider"
      width="256"
      collapsible
      collapsed={collapsed}
      collapsedWidth={60}
      onCollapse={setCollapsed}
    >
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={menus}
        onClick={changeMenu}
      />
    </Sider>
  );
};

export default SiderMenu;
