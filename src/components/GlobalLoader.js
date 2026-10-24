import React from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";

export default function GlobalLoader() {
  const loadingCount = useSelector(
    (state) => state.loader.loadingCount
  );

  return (
    <Spin
      spinning={loadingCount > 0}
      fullscreen
      size="large"
      tip="Loading..."
      style={{
        zIndex: 99999,
      }}
    />
  );
}