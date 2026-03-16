import React from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    List,
} from "antd";

export const Dashboard = () => {
  return (
    <div className="space-y-4">
      <ShowTimeDashboard />
    </div>
);

/* ================= CARD STYLE ================= */

const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    padding: 10,
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    background: "#1a0709",
    border: "1px solid #2a0c0f",
    color: "#fff",
};

export default Dashboard;
