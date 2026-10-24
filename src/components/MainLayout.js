
import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Button,
  Grid,
  Space,
  Badge,
  Dropdown,
  Avatar,
} from "antd";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  DollarOutlined,
  LogoutOutlined,
  HeartFilled,
  BellOutlined,
  ProfileOutlined,
  LockOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  FolderOutlined,
  UserAddOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const { Header, Sider, Content } = Layout;

// Map database icon names to Ant Design icon components
const iconMap = {
  dashboard: DashboardOutlined,
  "layout-dashboard": DashboardOutlined,

  database: DatabaseOutlined,
  appstore: AppstoreOutlined,
  "layout-grid": AppstoreOutlined,
  folder: FolderOutlined,

  users: TeamOutlined,
  "user-round": UserOutlined,
  "user": UserOutlined,
  "user-plus": UserAddOutlined,
  "user-round-plus": UserAddOutlined,

  "clipboard-list": FileTextOutlined,
  "file-text": FileTextOutlined,

  stethoscope: MedicineBoxOutlined,
  calendar: CalendarOutlined,
  dollar: DollarOutlined,
  settings: SettingOutlined,
};

// Read the logged-in user from localStorage
const getLoggedInUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return {};
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to read user from localStorage:", error);
    return {};
  }
};

// Convert hierarchical modules into Ant Design Menu items
const convertModulesToMenuItems = (modules) => {
  if (!Array.isArray(modules)) {
    return [];
  }

  return modules
    .filter(
      (module) =>
        module.status === "ACTIVE" &&
        module.routePath
    )
    .sort(
      (a, b) =>
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    )
    .map((module) => {
      const IconComponent =
        iconMap[module.icon] || AppstoreOutlined;

      const children = convertModulesToMenuItems(
        module.children || []
      );

      return {
        // Use the database ID as the unique menu key
        key: String(module.id),

        icon: <IconComponent />,

        label: module.moduleName,

        // Include children only when they exist
        ...(children.length > 0 && {
          children,
        }),
      };
    });
};

// Flatten the hierarchy to find routes and selected menu items
const flattenModules = (modules, result = []) => {
  if (!Array.isArray(modules)) {
    return result;
  }

  modules.forEach((module) => {
    if (
      module.status === "ACTIVE" &&
      module.routePath
    ) {
      result.push(module);
    }

    flattenModules(module.children || [], result);
  });

  return result;
};

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const [userModules, setUserModules] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();

  // Load the logged-in user's modules from localStorage
  useEffect(() => {
    const user = getLoggedInUser();

    setUserModules(
      Array.isArray(user.modules) ? user.modules : []
    );
  }, []);

  // Generate sidebar items dynamically
  const menuItems = useMemo(
    () => convertModulesToMenuItems(userModules),
    [userModules]
  );

  // Flatten modules to handle route selection
  const allModules = useMemo(
    () => flattenModules(userModules),
    [userModules]
  );

  // Find the deepest module matching the current URL
  const selectedModule = useMemo(() => {
    const pathname = location.pathname;

    return allModules
      .filter(
        (module) =>
          pathname === module.routePath ||
          pathname.startsWith(
            module.routePath.replace(/\/$/, "") + "/"
          )
      )
      .sort(
        (a, b) =>
          b.routePath.length - a.routePath.length
      )[0];
  }, [allModules, location.pathname]);

  const selectedKey = selectedModule
    ? String(selectedModule.id)
    : "";

  // Navigate using the module's routePath
  const handleMenuClick = ({ key }) => {
    const selected = allModules.find(
      (module) => String(module.id) === String(key)
    );

    if (selected?.routePath) {
      navigate(selected.routePath);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // Profile dropdown
  const handleProfileClick = ({ key }) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;

      case "changePassword":
        navigate("/change-password");
        break;

      case "logout":
        handleLogout();
        break;

      default:
        break;
    }
  };

  const profileItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "My Profile",
    },
    {
      key: "changePassword",
      icon: <LockOutlined />,
      label: "Change Password",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        trigger={null}
        theme="light"
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            overflow: "hidden",
          }}
        >
          <HeartFilled
            style={{
              color: "#1677ff",
              fontSize: 25,
              flexShrink: 0,
            }}
          />

          {!collapsed && (
            <Typography.Title
              level={4}
              style={{
                color: "black",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              CareSuite
            </Typography.Title>
          )}
        </div>

        {/* Dynamic hierarchical menu */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            paddingBottom: 70,
          }}
        />

        {/* Sidebar logout */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            width: "100%",
            padding: collapsed ? "0 8px" : "0 16px",
          }}
        >
          <Button
            danger
            block={!collapsed}
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      {/* Main layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {/* Left section */}
          <Space size={16}>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
            />

            <Typography.Text strong>
              Hospital Management System
            </Typography.Text>
          </Space>

          {/* Right section */}
          <Space size={20}>
            {/* Notifications */}
            <Badge count={3} size="small" offset={[-2, 3]}>
              <Button
                type="text"
                shape="circle"
                icon={
                  <BellOutlined style={{ fontSize: 20 }} />
                }
                onClick={() => navigate("/notifications")}
                title="Notifications"
              />
            </Badge>

            {/* Profile dropdown */}
            <Dropdown
              menu={{
                items: profileItems,
                onClick: handleProfileClick,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                style={{
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 8px",
                }}
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#1677ff",
                  }}
                />
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Page content */}
        <Content
          style={{
            margin: 16,
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            minHeight: 280,
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
