import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Title } = Typography;
const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleChangePassword = () => {
        const savedPassword = localStorage.getItem("password") || "12345";
        if (oldPassword !== savedPassword) {
            message.error("Mật khẩu cũ không đúng");
            return;
        }
        if (oldPassword === newPassword) {
            message.error("Mật khẩu mới phải khác mật khẩu cũ");
            return;
        }
        localStorage.setItem("password", newPassword);
        message.success("Đổi mật khẩu thành công");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

    };
    return (
        <div style={{
            minHeight: "100vh",
            background: "#0B0B0F",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Card
                style={{
                    width: 400,
                    background: "#1a0e10",
                    color: "#fff",
                    borderRadius: 16,
                }}>
                <Title level={3} style={{ color: "#fff" }}>
                    Đổi mật khẩu
                </Title>
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{marginBottom:16}}
                />
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{marginBottom:16}}
                />
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{marginBottom:16}}
                />
                <Button type="primary" block onClick={handleChangePassword}
                    style={{ marginTop: 16 }}>
                    Cập nhật mật khẩu
                </Button>
            </Card>
        </div>
    )
}
export default ChangePassword;