import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { axiosAuth } from "@web/hooks/useAuth";
import { API } from "@web/api/api.service";

const { Title } = Typography;

const ChangePassword: React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (newPassword !== confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp");
            return;
        }
        try {
            setLoading(true);
            await axiosAuth.post(`${API.AUTH}/change-password`, { oldPassword, newPassword });
            message.success("Đổi mật khẩu thành công");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0B0B0F",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Card style={{
                width: 400,
                background: "#1a0e10",
                color: "#fff",
                borderRadius: 16,
            }}>
                <Title level={3} style={{ color: "#fff" }}>Đổi mật khẩu</Title>
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{ marginBottom: 16, color: "black" }}
                />
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ marginBottom: 16, color: "black" }}
                />
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ marginBottom: 16, color: "black" }}
                />
                <Button
                    type="primary"
                    block
                    loading={loading}
                    onClick={handleChangePassword}
                    style={{ marginTop: 16 }}
                >
                    Cập nhật mật khẩu
                </Button>
            </Card>
        </div>
    );
};

export default ChangePassword;
