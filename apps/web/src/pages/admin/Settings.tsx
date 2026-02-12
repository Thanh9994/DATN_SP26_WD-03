import { Card, Switch, Button, Space, Typography } from "antd";

const { Title, Text } = Typography;

const Settings = () => {
    return (
        <div style={{ padding: 24, maxWidth: 600 }}>
            <Title level={3}>Settings</Title>

            <Card>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    {/* Dark Mode */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Text strong>Dark Mode</Text>
                            <br />
                            <Text type="secondary">
                                Enable dark theme for admin dashboard
                            </Text>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    {/* Maintenance */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Text strong>System Maintenance</Text>
                            <br />
                            <Text type="secondary">
                                Put the system into maintenance mode
                            </Text>
                        </div>
                        <Switch />
                    </div>

                    <Button type="primary" style={{ alignSelf: "flex-end" }}>
                        Save Changes
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default Settings;
