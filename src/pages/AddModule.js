
import React from "react";
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  AppstoreOutlined,
  CodeOutlined,
  LinkOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  SettingOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AddModule() {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Module Details:", values);
  };

  const iconOptions = [
    { value: "AppstoreOutlined", label: "Appstore" },
    { value: "UserOutlined", label: "User" },
    { value: "SettingOutlined", label: "Settings" },
    { value: "FileOutlined", label: "File" },
    { value: "ApartmentOutlined", label: "Hierarchy" },
    { value: "SafetyOutlined", label: "Security" },
    { value: "UnorderedListOutlined", label: "List" },
  ];

  const parentModuleOptions = [
    { value: "dashboard", label: "Dashboard" },
    { value: "masters", label: "Masters" },
    { value: "patient-management", label: "Patient Management" },
    { value: "reports", label: "Reports" },
  ];

  const moduleGroupOptions = [
    { value: "master", label: "Master" },
    { value: "transaction", label: "Transaction" },
    { value: "reports", label: "Reports" },
    { value: "administration", label: "Administration" },
  ];

  const accessLevelOptions = [
    { value: "NORMAL", label: "Normal" },
    { value: "RESTRICTED", label: "Restricted" },
    { value: "ADMIN", label: "Admin Only" },
  ];

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Title level={3} style={{ margin: 0 }}>
            Create Module
          </Title>
          <Text type="secondary">
            Add a new module to the system. Only Super User can create modules.
          </Text>
        </div>

        <Card
          bordered
          style={{ borderRadius: 10 }}
          styles={{ body: { padding: 24 } }}
        >
          <Space align="start" size={12} style={{ marginBottom: 24 }}>
            <AppstoreOutlined
              style={{ fontSize: 21, color: "#1677ff", marginTop: 4 }}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Basic Information
              </Title>
              <Text type="secondary">
                Enter the module details below.
              </Text>
            </div>
          </Space>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              sortOrder: 1,
              status: true,
              accessLevel: "NORMAL",
            }}
          >
            <Row gutter={[24, 8]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Module Name"
                  name="moduleName"
                  rules={[
                    { required: true, message: "Please enter module name" },
                  ]}
                >
                  <Input
                    prefix={<AppstoreOutlined />}
                    placeholder="Enter module name"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Module Code"
                  name="moduleCode"
                  rules={[
                    { required: true, message: "Please enter module code" },
                    {
                      pattern: /^[A-Z][A-Z0-9_]*$/,
                      message: "Use uppercase letters, numbers and underscores",
                    },
                  ]}
                  extra="Must be unique (e.g. PATIENT_REGISTRATION)"
                >
                  <Input
                    prefix={<CodeOutlined />}
                    placeholder="Enter unique module code"
                    size="large"
                    style={{ textTransform: "uppercase" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Description" name="description">
                  <TextArea
                    rows={3}
                    placeholder="Enter module description (optional)"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Route Path"
                  name="routePath"
                  rules={[
                    { required: true, message: "Please enter route path" },
                    {
                      pattern: /^\/[a-zA-Z0-9/_-]*$/,
                      message: "Route must start with /",
                    },
                  ]}
                  extra="Used for navigation (e.g. /patients)"
                >
                  <Input
                    prefix={<LinkOutlined />}
                    placeholder="Enter route path (e.g. /patients)"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Icon" name="icon">
                  <Select
                    size="large"
                    placeholder="Select icon"
                    options={iconOptions}
                    allowClear
                  />
                </Form.Item>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Choose an icon from the available options.
                </Text>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Sort Order"
                  name="sortOrder"
                  rules={[
                    { required: true, message: "Please enter sort order" },
                  ]}
                  extra="Determines display order among siblings"
                >
                  <InputNumber
                    min={1}
                    precision={0}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Enter sort order"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Space align="start" size={12} style={{ marginBottom: 16 }}>
              <ApartmentOutlined
                style={{ fontSize: 20, color: "#1677ff", marginTop: 4 }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Parent Module
                </Title>
                <Text type="secondary">
                  Select a parent module to create a submodule. Leave empty for a root module.
                </Text>
              </div>
            </Space>

            <Form.Item name="parentModule">
              <Select
                size="large"
                placeholder="Select parent module (optional)"
                options={parentModuleOptions}
                allowClear
              />
            </Form.Item>

            <Divider />

            <Space align="start" size={12} style={{ marginBottom: 16 }}>
              <SafetyOutlined
                style={{ fontSize: 20, color: "#1677ff", marginTop: 4 }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Status
                </Title>
                <Text type="secondary">Set the module status.</Text>
              </div>
            </Space>

            <Form.Item
              name="status"
              valuePropName="checked"
              style={{ marginBottom: 8 }}
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Inactive modules will not be visible in the system.
            </Text>

            <Divider />

            <Space align="start" size={12} style={{ marginBottom: 20 }}>
              <SettingOutlined
                style={{ fontSize: 20, color: "#1677ff", marginTop: 4 }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Additional Information
                </Title>
                <Text type="secondary">
                  Optional settings for better organization.
                </Text>
              </div>
            </Space>

            <Card
              size="small"
              bordered={false}
              style={{ background: "#f5f8fc", marginBottom: 24 }}
            >
              <Row gutter={[20, 8]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Module Group"
                    name="moduleGroup"
                    style={{ marginBottom: 8 }}
                  >
                    <Select
                      placeholder="Select group (optional)"
                      options={moduleGroupOptions}
                      allowClear
                    />
                  </Form.Item>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Helps in organizing modules (e.g. Patient, Master, Reports).
                  </Text>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Access Level"
                    name="accessLevel"
                    style={{ marginBottom: 8 }}
                  >
                    <Select options={accessLevelOptions} />
                  </Form.Item>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Used for future permission management.
                  </Text>
                </Col>
              </Row>
            </Card>

            <Divider />

            <Row justify="space-between" align="middle" gutter={[12, 12]}>
              <Col>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>

              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Create Module
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
}