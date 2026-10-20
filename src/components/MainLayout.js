
import React, { useState } from "react";
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
  PlusCircleFilled,
  BellOutlined,
  ProfileOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/patients",
      icon: <UserOutlined />,
      label: "Patients",
    },
    {
      key: "/doctors",
      icon: <MedicineBoxOutlined />,
      label: "Doctors",
    },
    {
      key: "/appointments",
      icon: <CalendarOutlined />,
      label: "Appointments",
    },
    {
      key: "/billing",
      icon: <DollarOutlined />,
      label: "Billing",
    },
    {
      key: "/createModule",
      icon: <PlusCircleFilled />,
      label: "Create Module",
    },
  ];

  const selectedKey =
    menuItems.find((item) =>
      location.pathname.startsWith(item.key)
    )?.key || "/dashboard";

  const handleLogout = () => {
    // Add token/session cleanup here when authentication is implemented.
    navigate("/login");
  };

const handleMenuClick = ({ key }) => {
  switch (key) {
    case "profile":
      navigate("/profile");
      break;

    case "changePassword":
      navigate("/change-password");
      break;

    case "logout":
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
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
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        trigger={null}
        theme="light"
      >
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
            style={{ color: "#1677ff", fontSize: 25 }}
          />

          {!collapsed && (
            <Title
              level={4}
              style={{ color: "black", margin: 0 }}
            >
              CareSuite
            </Title>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />

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

      <Layout>
        
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
        icon={<BellOutlined style={{ fontSize: 20 }} />}
        onClick={() => navigate("/notifications")}
        title="Notifications"
      />
    </Badge>

    {/* Profile dropdown */}
    <Dropdown
      menu={{
        items: profileItems,
        onClick: handleMenuClick,
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
