
import React from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Table,
  Tag,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  DollarOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Dashboard() {
  const recentPatients = [
    {
      key: "1",
      patientName: "Rahul Sharma",
      doctor: "Dr. Amit Patil",
      department: "Cardiology",
      status: "Completed",
    },
    {
      key: "2",
      patientName: "Priya Deshmukh",
      doctor: "Dr. Neha Joshi",
      department: "Neurology",
      status: "Pending",
    },
    {
      key: "3",
      patientName: "Akash More",
      doctor: "Dr. Amit Patil",
      department: "Cardiology",
      status: "In Progress",
    },
    {
      key: "4",
      patientName: "Sneha Kulkarni",
      doctor: "Dr. Rahul Shah",
      department: "Orthopedics",
      status: "Completed",
    },
  ];

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Completed"
            ? "success"
            : status === "Pending"
            ? "warning"
            : "processing";

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
      >
        <Col>
          <Title level={2} style={{ marginBottom: 4 }}>
            Hospital Dashboard
          </Title>
          <Text type="secondary">
            Welcome back! Here is your hospital overview.
          </Text>
        </Col>

        <Col>
          <Space wrap>
            <Button
              type="primary"
              icon={<PlusOutlined />}
            >
              Register Patient
            </Button>

            <Button icon={<CalendarOutlined />}>
              New Appointment
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <UserOutlined
                style={{ fontSize: 28, color: "#1677ff" }}
              />
              <div>
                <Text type="secondary">Total Patients</Text>
                <Title level={3} style={{ margin: 0 }}>
                  1,248
                </Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <MedicineBoxOutlined
                style={{ fontSize: 28, color: "#52c41a" }}
              />
              <div>
                <Text type="secondary">Total Doctors</Text>
                <Title level={3} style={{ margin: 0 }}>
                  42
                </Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <CalendarOutlined
                style={{ fontSize: 28, color: "#faad14" }}
              />
              <div>
                <Text type="secondary">Appointments Today</Text>
                <Title level={3} style={{ margin: 0 }}>
                  86
                </Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Space>
              <DollarOutlined
                style={{ fontSize: 28, color: "#722ed1" }}
              />
              <div>
                <Text type="secondary">Today's Revenue</Text>
                <Title level={3} style={{ margin: 0 }}>
                  ₹48,500
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title="Recent Patient Activity"
        style={{ marginTop: 24 }}
      >
        <Table
          columns={columns}
          dataSource={recentPatients}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}
