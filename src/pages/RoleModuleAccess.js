
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Checkbox,
  Button,
  Input,
  Space,
  Typography,
  Tag,
  Tooltip,
  message,
  Row,
  Col,
  Select,
} from "antd";

import {
  SafetyCertificateOutlined,
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import axios from "axios";
import { BASE_URL } from "../apisConfig/baseUrl";
import { getToken } from "../common/CommonUtils";

const { Title, Text } = Typography;

const RoleModuleAccess = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Format: { "moduleId_roleId": true }
  const [accessMap, setAccessMap] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [moduleStatus, setModuleStatus] = useState("ACTIVE");

  // --------------------------------------------------
  // FETCH ROLES, MODULES AND SAVED PERMISSIONS
  // --------------------------------------------------
  const fetchRolesAndModules = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/modules/roles-modules`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        }
      );

      // Supports direct response or { data: {...} }
      const result = response.data?.data ?? response.data;

      const rolesData = result?.roles ?? [];
      const modulesData = result?.modules ?? [];
      const permissionsData = result?.permissions ?? [];

      setRoles(rolesData);
      setModules(modulesData);
      setPermissions(permissionsData);

      // Convert backend permissions to checkbox state.
      // Example: "1_RLNO0001": true
      const savedAccessMap = {};

      permissionsData.forEach((permission) => {
        const moduleId = String(permission.moduleId ?? "");
        const roleId = String(permission.roleId ?? "");

        if (moduleId && roleId) {
          savedAccessMap[`${moduleId}_${roleId}`] = true;
        }
      });

      setAccessMap(savedAccessMap);

    } catch (error) {
      console.error(
        "Error fetching roles, modules and permissions:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to fetch roles, modules and permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndModules();
  }, []);

  // --------------------------------------------------
  // ARRANGE MODULES HIERARCHICALLY
  // --------------------------------------------------
  const hierarchicalModules = useMemo(() => {
    const sortedModules = [...modules].sort(
      (a, b) =>
        (Number(a.sortOrder) || 0) -
          (Number(b.sortOrder) || 0) ||
        (Number(a.id) || 0) - (Number(b.id) || 0)
    );

    const result = [];
    const visited = new Set();

    const addChildren = (parentId, level) => {
      sortedModules
        .filter(
          (module) =>
            String(module.parentModule ?? "") ===
            String(parentId ?? "")
        )
        .forEach((module) => {
          const id = String(module.id);

          if (visited.has(id)) return;

          visited.add(id);

          result.push({
            ...module,
            level,
          });

          addChildren(module.id, level + 1);
        });
    };

    // Root modules first
    addChildren(null, 0);

    // Include orphaned modules whose parent is missing
    sortedModules.forEach((module) => {
      const id = String(module.id);

      if (!visited.has(id)) {
        visited.add(id);

        result.push({
          ...module,
          level: 0,
        });

        addChildren(module.id, 1);
      }
    });

    return result;
  }, [modules]);

  // --------------------------------------------------
  // SEARCH AND FILTER MODULES
  // --------------------------------------------------
  const filteredModules = useMemo(() => {
    return hierarchicalModules.filter((module) => {
      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        module.moduleName?.toLowerCase().includes(search) ||
        module.moduleCode?.toLowerCase().includes(search);

      const matchesStatus =
        moduleStatus === "ALL" ||
        module.status === moduleStatus;

      return matchesSearch && matchesStatus;
    });
  }, [hierarchicalModules, searchText, moduleStatus]);

  // --------------------------------------------------
  // DISPLAY ROLES
  // --------------------------------------------------
  const displayedRoles = useMemo(() => {
    const activeRoles = roles.filter(
      (role) => role.status === "A"
    );

    const availableRoles =
      activeRoles.length > 0 ? activeRoles : roles;

    if (selectedRole === "ALL") {
      return availableRoles;
    }

    return availableRoles.filter(
      (role) => String(role.roleId) === String(selectedRole)
    );
  }, [roles, selectedRole]);

  // --------------------------------------------------
  // TOGGLE ONE MODULE AND ROLE PERMISSION
  // --------------------------------------------------
  const handleAccessChange = (moduleId, roleId, checked) => {
    const key = `${String(moduleId)}_${String(roleId)}`;

    setAccessMap((previous) => {
      const updated = { ...previous };

      if (checked) {
        updated[key] = true;
      } else {
        delete updated[key];
      }

      return updated;
    });
  };

  // --------------------------------------------------
  // SELECT ALL MODULES FOR A ROLE
  // --------------------------------------------------
  const handleRoleSelectAll = (roleId, checked) => {
    setAccessMap((previous) => {
      const updated = { ...previous };

      filteredModules.forEach((module) => {
        const key = `${String(module.id)}_${String(roleId)}`;

        if (checked) {
          updated[key] = true;
        } else {
          delete updated[key];
        }
      });

      return updated;
    });
  };

  // --------------------------------------------------
  // SELECT ALL ROLES FOR A MODULE
  // --------------------------------------------------
  const handleModuleSelectAll = (moduleId, checked) => {
    setAccessMap((previous) => {
      const updated = { ...previous };

      displayedRoles.forEach((role) => {
        const key = `${String(moduleId)}_${String(role.roleId)}`;

        if (checked) {
          updated[key] = true;
        } else {
          delete updated[key];
        }
      });

      return updated;
    });
  };

  // Count checked permissions for the currently loaded data
  const selectedCount = Object.values(accessMap).filter(
    Boolean
  ).length;

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------
  const columns = [
    {
      title: (
        <Space>
          <AppstoreOutlined />
          <span>MODULES</span>
        </Space>
      ),
      dataIndex: "moduleName",
      key: "moduleName",
      fixed: "left",
      width: 300,
      render: (_, record) => (
        <Space
          style={{
            paddingLeft: record.level * 24,
          }}
          size={10}
        >
          {record.level === 0 ? (
            <AppstoreOutlined
              style={{
                color: "#1677ff",
                fontSize: 17,
              }}
            />
          ) : (
            <span
              style={{
                color: "#bfbfbf",
                paddingLeft: 2,
              }}
            >
              └
            </span>
          )}

          <div>
            <Text strong={record.level === 0}>
              {record.moduleName}
            </Text>

            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {record.moduleCode}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },

    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 105,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "success" : "default"}>
          {status}
        </Tag>
      ),
    },

    {
      title: "ALL ROLES",
      key: "moduleSelectAll",
      width: 100,
      align: "center",
      render: (_, record) => {
        const checkedCount = displayedRoles.filter(
          (role) =>
            !!accessMap[
              `${String(record.id)}_${String(role.roleId)}`
            ]
        ).length;

        return (
          <Tooltip title="Select or clear access for all displayed roles">
            <Checkbox
              checked={
                displayedRoles.length > 0 &&
                checkedCount === displayedRoles.length
              }
              indeterminate={
                checkedCount > 0 &&
                checkedCount < displayedRoles.length
              }
              onChange={(event) =>
                handleModuleSelectAll(
                  record.id,
                  event.target.checked
                )
              }
            />
          </Tooltip>
        );
      },
    },

    ...displayedRoles.map((role) => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <TeamOutlined
            style={{
              display: "block",
              marginBottom: 5,
            }}
          />

          <Text strong>{role.roleName}</Text>

          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {role.roleId || "No role ID"}
            </Text>
          </div>

          <Tooltip title={`Select all modules for ${role.roleName}`}>
            <Checkbox
              style={{ marginTop: 8 }}
              checked={
                filteredModules.length > 0 &&
                filteredModules.every(
                  (module) =>
                    !!accessMap[
                      `${String(module.id)}_${String(role.roleId)}`
                    ]
                )
              }
              indeterminate={
                filteredModules.some(
                  (module) =>
                    !!accessMap[
                      `${String(module.id)}_${String(role.roleId)}`
                    ]
                ) &&
                !filteredModules.every(
                  (module) =>
                    !!accessMap[
                      `${String(module.id)}_${String(role.roleId)}`
                    ]
                )
              }
              onChange={(event) =>
                handleRoleSelectAll(
                  role.roleId,
                  event.target.checked
                )
              }
            />
          </Tooltip>
        </div>
      ),
      key: String(role.roleId),
      width: 155,
      align: "center",
      render: (_, module) => (
        <Checkbox
          checked={
            !!accessMap[
              `${String(module.id)}_${String(role.roleId)}`
            ]
          }
          onChange={(event) =>
            handleAccessChange(
              module.id,
              role.roleId,
              event.target.checked
            )
          }
        />
      ),
    })),
  ];

  // --------------------------------------------------
  // SAVE ONLY SELECTED PERMISSIONS API
  // --------------------------------------------------
  const handleSave = async () => {
    if (!roles.length || !modules.length) {
      message.warning("No roles or modules are available to save.");
      return;
    }

    // Include only checked module/role combinations.
    // Do not send the existing database ID because the backend deletes
    // previous records by addedBy and then inserts these as new records.
    const selectedPermissions = Object.entries(accessMap)
      .filter(([, checked]) => Boolean(checked))
      .map(([key]) => {
        const separatorIndex = key.indexOf("_");
        const moduleId = key.substring(0, separatorIndex);
        const roleId = key.substring(separatorIndex + 1);

        const existingPermission = permissions.find(
          (permission) =>
            String(permission.moduleId) === moduleId &&
            String(permission.roleId) === roleId
        );

        return {
          moduleId,
          roleId,
          allowRead: existingPermission?.allowRead ?? "Y",
          allowCreate: existingPermission?.allowCreate ?? "N",
          allowUpdate: existingPermission?.allowUpdate ?? "N",
          allowDelete: existingPermission?.allowDelete ?? "N",
        };
      });

    setSaving(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/rolePermissions/update`,
        selectedPermissions,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      message.success(
        response.data?.message || "Permissions updated successfully."
      );

      // Reload saved permissions from the backend.
      await fetchRolesAndModules();
    } catch (error) {
      console.error("Error updating role/module permissions:", error);

      message.error(
        error.response?.data?.message ||
          "Failed to update permissions. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
      <Row
        justify="space-between"
        align="middle"
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
      >
        <Col>
          <Space align="start" size={14}>
            <div
              style={{
                background: "#e6f4ff",
                borderRadius: 10,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SafetyCertificateOutlined
                style={{
                  fontSize: 25,
                  color: "#1677ff",
                }}
              />
            </div>

            <div>
              <Title level={3} style={{ margin: 0 }}>
                Role & Module Access
              </Title>

              <Text type="secondary">
                Manage module permissions for each system role
              </Text>
            </div>
          </Space>
        </Col>

        <Col>
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRolesAndModules}
              loading={loading}
            >
              Refresh
            </Button>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              disabled={loading || saving}
            >
              Save Permissions
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Space size={14}>
              <TeamOutlined
                style={{
                  fontSize: 25,
                  color: "#1677ff",
                }}
              />

              <div>
                <Text type="secondary">Total Roles</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {roles.length}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Space size={14}>
              <AppstoreOutlined
                style={{
                  fontSize: 25,
                  color: "#722ed1",
                }}
              />

              <div>
                <Text type="secondary">Total Modules</Text>
                <Title level={3} style={{ margin: 0 }}>
                  {modules.length}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Space size={14}>
              <CheckCircleOutlined
                style={{
                  fontSize: 25,
                  color: "#389e0d",
                }}
              />

              <div>
                <Text type="secondary">
                  Selected Access Cells
                </Text>

                <Title level={3} style={{ margin: 0 }}>
                  {selectedCount}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Permissions Table */}
      <Card
        title={
          <Space>
            <SafetyCertificateOutlined />
            <span>Module Permissions Matrix</span>
          </Space>
        }
        extra={
          <Text type="secondary">
            Check a box to enable access
          </Text>
        }
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: 16 }}>
          <Row gutter={[12, 12]} justify="space-between">
            <Col xs={24} md={10}>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search module name or code..."
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
              />
            </Col>

            <Col xs={24} md={7}>
              <Select
                style={{ width: "100%" }}
                value={moduleStatus}
                onChange={setModuleStatus}
                options={[
                  {
                    label: "All Module Statuses",
                    value: "ALL",
                  },
                  {
                    label: "Active Modules",
                    value: "ACTIVE",
                  },
                  {
                    label: "Inactive Modules",
                    value: "INACTIVE",
                  },
                ]}
              />
            </Col>

            <Col xs={24} md={7}>
              <Select
                style={{ width: "100%" }}
                value={selectedRole}
                onChange={setSelectedRole}
                options={[
                  {
                    label: "All Active Roles",
                    value: "ALL",
                  },
                  ...roles.map((role) => ({
                    label: role.roleName,
                    value: role.roleId,
                  })),
                ]}
              />
            </Col>
          </Row>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredModules}
          loading={loading}
          bordered
          size="middle"
          pagination={false}
          scroll={{
            x: "max-content",
            y: 500,
          }}
          locale={{
            emptyText: "No modules found",
          }}
        />

        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Row
            justify="space-between"
            align="middle"
            gutter={[8, 8]}
          >
            <Col>
              <Text type="secondary">
                Showing {filteredModules.length} of {modules.length} modules
              </Text>
            </Col>

            <Col>
              <Space>
                <Text type="secondary">
                  Selected: {selectedCount}
                </Text>

                <Button
                  onClick={() => setAccessMap({})}
                >
                  Clear Selections
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default RoleModuleAccess;