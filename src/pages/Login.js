import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import { BASE_URL } from "../apisConfig/baseUrl";
import {
  showLoad,
  hideLoader,
} from "../redux/slices/loaderSlice";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
useEffect(()=>{
localStorage.removeItem("token");
},[])
  
  const handleLogin = async (values) => {
    dispatch(showLoad());

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          username: values.username,
          password: values.password,
        }
      );

      const data = response.data;

      if (!data?.jwtToken || !data?.userId) {
        message.error("Invalid login response from server.");
        return;
      }

      // Store the JWT separately
      localStorage.setItem("token", data.jwtToken);

      // Store all other user details in one object
      const user = { ...data };
      delete user.jwtToken;

      localStorage.setItem("user", JSON.stringify(user));

      message.success("Login successful!");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your Username and Password.";

      message.error(errorMessage);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Welcome Back
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Login to your account
        </Text>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
          }}
        >
          Welcome back! Please enter your credentials.
        </Text>
      </Card>
    </div>
  );
}