import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Space,
  message,
  Table,
  Modal,
  Tag,
  Tooltip,
} from "antd";

import {
  UserAddOutlined,
  SaveOutlined,
  ReloadOutlined,
  HomeOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { BASE_URL } from "../apisConfig/baseUrl";
import { getToken } from "../common/CommonUtils";
import { useDispatch } from "react-redux";

import {
  showLoader,
  hideLoader,
} from "../redux/slices/loaderSlice";

const { Title } = Typography;

const AddUser = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Common API headers
  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  // Fetch users
  const getListOfUsers = useCallback(
    async (manageLoader = true) => {
      if (manageLoader) {
        dispatch(showLoader());
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/user/getAllByParent`,
          {
            headers: getHeaders(),
          }
        );

        setUsers(
          Array.isArray(response.data) ? response.data : []
        );

        return true;
      } catch (error) {
        console.error("Error fetching users:", error);

        message.error(
          error.response?.data?.message ||
            "Failed to fetch users."
        );

        return false;
      } finally {
        if (manageLoader) {
          dispatch(hideLoader());
        }
      }
    },
    [dispatch]
  );

  // Load users when the page opens
  useEffect(() => {
    getListOfUsers();
  }, [getListOfUsers]);

  // Open Add User modal
  const handleAddUser = () => {
    form.resetFields();
    setSelectedUser(null);
    setIsEditing(false);

    form.setFieldsValue({
      status: "A",
    });

    setModalOpen(true);
  };

  // Open Edit User modal with selected user's details
  const handleEditUser = (record) => {
    setSelectedUser(record);
    setIsEditing(true);

    form.resetFields();

    form.setFieldsValue({
      hospitalId: record.hospitalId,
      userId: record.userId,
      userName: record.userName,
      email: record.email,
      role: record.role,
      mobile: record.mobile,
      status: record.status,

      // Do not prefill a stored/encoded password.
      // Leave it blank to retain the existing password.
      password: "",
    });

    setModalOpen(true);
  };

  // Delete action - console only, no API call
  const handleDeleteUser = (record) => {
    console.log("Delete user clicked:", record);

    message.info(
      `Delete clicked for user: ${record.userId}`
    );
  };

  // Close modal
  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setSelectedUser(null);
    setIsEditing(false);
  };

  // Save or Update User
  const handleSubmit = async (values) => {
    dispatch(showLoader());

    try {
      const payload = {
        hospitalId: values.hospitalId,
        userId: values.userId,
        userName: values.userName,
        email: values.email,
        role: values.role,
        mobile: values.mobile,
        status: values.status,
      };

      // Send password only when the user enters one.
      // On update, an empty password means keep the existing password.
      if (values.password) {
        payload.password = values.password;
      }

      // Send actionState only for updates
      if (isEditing) {
        payload.actionState = "update";
      }

      const response = await axios.post(
        `${BASE_URL}/user/save`,
        payload,
        {
          headers: getHeaders(),
        }
      );

      message.success(
        response.data?.message ||
          (isEditing
            ? "User updated successfully!"
            : "User saved successfully!")
      );

      setModalOpen(false);
      form.resetFields();
      setSelectedUser(null);
      setIsEditing(false);

      // Refresh the table without toggling the loader again
      await getListOfUsers(false);
    } catch (error) {
      console.error(
        isEditing ? "Error updating user:" : "Error saving user:",
        error
      );

      if (error.response) {
        const errorData = error.response.data;

        message.error(
          typeof errorData === "string"
            ? errorData
            : errorData?.message ||
                (isEditing
                  ? "Failed to update user."
                  : "Failed to save user.")
        );
      } else if (error.request) {
        message.error(
          "Unable to connect to the server. Please check your backend."
        );
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  // Reset form
  const handleReset = () => {
    if (isEditing && selectedUser) {
      form.setFieldsValue({
        hospitalId: selectedUser.hospitalId,
        userId: selectedUser.userId,
        userName: selectedUser.userName,
        email: selectedUser.email,
        role: selectedUser.role,
        mobile: selectedUser.mobile,
        status: selectedUser.status,
        password: "",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: "A",
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => role || "-",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "A" ? "green" : "red"}>
          {status === "A" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit User">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>

          <Tooltip title="Delete User">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteUser(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Row
          align="middle"
          justify="space-between"
          gutter={[16, 16]}
        >
          <Col>
            <Space>
              <UserOutlined />
              <Title level={4} style={{ margin: 0 }}>
                Users
              </Title>
            </Space>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Col>
        </Row>

        <Table
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={users}
          rowKey={(record) =>
            `${record.hospitalId || ""}-${record.autoId || ""}-${record.userId || ""}`
          }
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <UserAddOutlined />
            {isEditing ? "Edit User" : "Add User"}
          </Space>
        }
        open={modalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "A",
          }}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Hospital ID"
                name="hospitalId"
                rules={[
                  {
                    required: true,
                    message: "Please enter Hospital ID",
                  },
                ]}
              >
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="Enter Hospital ID"
                  maxLength={6}
                  disabled={isEditing}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="User ID"
                name="userId"
                rules={[
                  {
                    required: true,
                    message: "Please enter User ID",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter User ID"
                  maxLength={20}
                  disabled={isEditing}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="User Name"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Please enter User Name",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter User Name"
                  maxLength={180}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: !isEditing,
                    message: "Please enter Password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Enter Password"
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter Email",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid Email",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter Email"
                  maxLength={90}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please select Role",
                  },
                ]}
              >
                <Select
                  placeholder="Select Role"
                  suffixIcon={<SafetyOutlined />}
                  options={[
                    {
                      label: "Superuser",
                      value: "SUPERUSER",
                    },
                    {
                      label: "Admin",
                      value: "ADMIN",
                    },
                    {
                      label: "Doctor",
                      value: "DOCTOR",
                    },
                    {
                      label: "Nurse",
                      value: "NURSE",
                    },
                    {
                      label: "Receptionist",
                      value: "RECEP",
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Mobile"
                name="mobile"
                rules={[
                  {
                    required: true,
                    message: "Please enter Mobile Number",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter Mobile Number"
                  maxLength={15}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please select Status",
                  },
                ]}
              >
                <Select
                  placeholder="Select Status"
                  options={[
                    {
                      label: "Active",
                      value: "A",
                    },
                    {
                      label: "Inactive",
                      value: "I",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              {isEditing ? "Update User" : "Save User"}
            </Button>

            <Button
              htmlType="button"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AddUser;