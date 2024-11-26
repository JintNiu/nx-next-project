import { Layout, Menu, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./index.scss";
import { MenuItemType, menuList, routePathMap } from "@/common/menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, useMyDispatch } from "@/store";
import { selectorSystem, setCollapsed, setPath } from "@/store/modules/systemSlice";

const { Sider } = Layout;

const formatMenuList = () => {};

const getCurrentMenuConfig = (menuList: MenuItemType[] = [], pathname = "") => {
  if (!pathname || pathname === "/") {
    return {
      openKeys: [],
      selectedKey: "home",
    };
  }

  const [_, ...pathList] = pathname.split("/");

  let openKeys: string[] = [];
  let selectedKey: string = "";

  const loop = (list: MenuItemType[] = []) => {
    let i = 0,
      len = list.length;
    let path = pathList.shift();
    for (i = 0; i < len; i++) {
      if (list[i]?.key === path) {
        if (pathList.length && list[i]?.children) {
          openKeys.push(list[i]?.key);
          loop(list[i]?.children);
          break;
        }
        selectedKey = list[i]?.key;
        break;
      }
    }
  };

  loop(menuList);

  return {
    openKeys,
    selectedKey,
  };
};

const SiderMenu = () => {
  const dispatch = useMyDispatch();
  const { collapsed } = useSelector(selectorSystem);

  const router = useRouter();
  const pathname = usePathname();

  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const init = useRef<boolean>(false);

  useEffect(() => {
    setMenus(menuList);
  }, []);

  useEffect(() => {
    dispatch(setPath(pathname));
  }, [pathname]);

  useEffect(() => {
    if (init.current || !menus?.length) {
      return;
    }
    console.log("[path pathname]", pathname);
    const config = getCurrentMenuConfig(menus, pathname);
    console.log("[path config]", config);
    setOpenKeys(config.openKeys);
    setSelectedKey(config.selectedKey);
    init.current = true;
  }, [menus, pathname]);

  useEffect(() => {
    if (selectedKey && routePathMap[selectedKey]) {
      router.push(routePathMap[selectedKey]);
    }
  }, [selectedKey]);

  return (
    <Sider
      theme="light"
      className="app-sider"
      width="256"
      collapsible
      collapsed={collapsed}
      collapsedWidth={60}
      onCollapse={(collapsed) => {
        dispatch(setCollapsed(collapsed));
      }}
    >
      <div className="customize-scrollbar" style={{ height: "100%" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : undefined}
          openKeys={openKeys}
          items={menus}
          onClick={(e) => {
            setSelectedKey(e.key);
          }}
          onOpenChange={setOpenKeys}
        />
      </div>
    </Sider>
  );
};

export default SiderMenu;
